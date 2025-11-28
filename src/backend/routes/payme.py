"""
Payme payment integration routes
Documentation: https://developer.help.paycom.uz/
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import hashlib
import base64
import time
import json

from database import get_db, Order
from auth import require_admin

router = APIRouter()

# Payme credentials
PAYME_MERCHANT_ID = "6928576d155c805660108939"
PAYME_TEST_KEY = "j1MhEdjYm9U7McURjDMt@y@WUA8Xq5C6HsX9"

# Payme endpoints
PAYME_CHECKOUT_URL = "https://checkout.paycom.uz"

class PaymeInitRequest(BaseModel):
    order_id: str
    amount: float  # Amount in sum (will be converted to tiyin)

class PaymeInitResponse(BaseModel):
    checkout_url: str
    transaction_id: Optional[str] = None

@router.post("/api/payme/init")
async def init_payme_payment(
    data: PaymeInitRequest,
    db: Session = Depends(get_db)
):
    """Initialize Payme payment"""
    
    # Get order
    order = db.query(Order).filter(Order.order_number == data.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Convert sum to tiyin (1 sum = 100 tiyin)
    amount_tiyin = int(data.amount * 100)
    
    # Create params for Payme
    params = {
        "m": PAYME_MERCHANT_ID,
        "ac.order_id": data.order_id,
        "a": amount_tiyin,
        "c": f"https://orient.uz/order/{data.order_id}"  # Return URL
    }
    
    # Encode params to base64
    params_str = ";".join([f"{k}={v}" for k, v in params.items()])
    params_base64 = base64.b64encode(params_str.encode()).decode()
    
    # Create checkout URL
    checkout_url = f"{PAYME_CHECKOUT_URL}/{params_base64}"
    
    return PaymeInitResponse(
        checkout_url=checkout_url
    )

@router.post("/api/payme/callback")
async def payme_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Payme callback endpoint (Merchant API)
    This endpoint handles Payme's JSON-RPC 2.0 requests
    """
    
    # Verify authorization
    auth_header = request.headers.get("Authorization")
    if not auth_header or not verify_payme_auth(auth_header):
        return {
            "error": {
                "code": -32504,
                "message": "Insufficient privilege to perform this method"
            }
        }
    
    # Parse JSON-RPC request
    try:
        body = await request.json()
        method = body.get("method")
        params = body.get("params", {})
        request_id = body.get("id")
    except:
        return {
            "error": {
                "code": -32700,
                "message": "Parse error"
            }
        }
    
    # Handle different methods
    if method == "CheckPerformTransaction":
        return handle_check_perform_transaction(params, request_id, db)
    
    elif method == "CreateTransaction":
        return handle_create_transaction(params, request_id, db)
    
    elif method == "PerformTransaction":
        return handle_perform_transaction(params, request_id, db)
    
    elif method == "CancelTransaction":
        return handle_cancel_transaction(params, request_id, db)
    
    elif method == "CheckTransaction":
        return handle_check_transaction(params, request_id, db)
    
    else:
        return {
            "error": {
                "code": -32601,
                "message": "Method not found"
            },
            "id": request_id
        }

def verify_payme_auth(auth_header: str) -> bool:
    """Verify Payme authorization header"""
    try:
        # Authorization: Basic base64(merchant_id:test_key)
        auth_type, credentials = auth_header.split(" ")
        if auth_type != "Basic":
            return False
        
        decoded = base64.b64decode(credentials).decode()
        merchant_id, key = decoded.split(":")
        
        return merchant_id == PAYME_MERCHANT_ID and key == PAYME_TEST_KEY
    except:
        return False

def handle_check_perform_transaction(params: dict, request_id: int, db: Session):
    """Check if transaction can be performed"""
    
    order_id = params.get("account", {}).get("order_id")
    amount = params.get("amount")
    
    if not order_id:
        return {
            "error": {
                "code": -31050,
                "message": "Order not found"
            },
            "id": request_id
        }
    
    # Get order
    order = db.query(Order).filter(Order.order_number == order_id).first()
    if not order:
        return {
            "error": {
                "code": -31050,
                "message": "Order not found"
            },
            "id": request_id
        }
    
    # Check amount (convert from tiyin to sum)
    expected_amount = int(order.total * 100)
    if amount != expected_amount:
        return {
            "error": {
                "code": -31001,
                "message": "Wrong amount"
            },
            "id": request_id
        }
    
    # Check if order is already paid
    if order.status == "completed":
        return {
            "error": {
                "code": -31008,
                "message": "Order already paid"
            },
            "id": request_id
        }
    
    return {
        "result": {
            "allow": True
        },
        "id": request_id
    }

def handle_create_transaction(params: dict, request_id: int, db: Session):
    """Create transaction"""
    
    transaction_id = params.get("id")
    order_id = params.get("account", {}).get("order_id")
    amount = params.get("amount")
    time_param = params.get("time")
    
    # Get order
    order = db.query(Order).filter(Order.order_number == order_id).first()
    if not order:
        return {
            "error": {
                "code": -31050,
                "message": "Order not found"
            },
            "id": request_id
        }
    
    # Store transaction info in order notes
    transaction_info = {
        "payme_transaction_id": transaction_id,
        "amount": amount,
        "time": time_param,
        "state": 1  # Created
    }
    
    existing_notes = order.notes or ""
    order.notes = f"{existing_notes}\n[Payme Transaction] {json.dumps(transaction_info)}"
    order.status = "processing"
    db.commit()
    
    return {
        "result": {
            "create_time": time_param,
            "transaction": str(transaction_id),
            "state": 1
        },
        "id": request_id
    }

def handle_perform_transaction(params: dict, request_id: int, db: Session):
    """Perform (complete) transaction"""
    
    transaction_id = params.get("id")
    
    # Find order by transaction ID in notes
    orders = db.query(Order).filter(Order.notes.contains(str(transaction_id))).all()
    
    if not orders:
        return {
            "error": {
                "code": -31003,
                "message": "Transaction not found"
            },
            "id": request_id
        }
    
    order = orders[0]
    
    # Update order status
    order.status = "completed"
    
    # Update transaction state in notes
    if order.notes:
        order.notes = order.notes.replace('"state": 1', '"state": 2')
    
    db.commit()
    
    current_time = int(time.time() * 1000)
    
    return {
        "result": {
            "transaction": str(transaction_id),
            "perform_time": current_time,
            "state": 2
        },
        "id": request_id
    }

def handle_cancel_transaction(params: dict, request_id: int, db: Session):
    """Cancel transaction"""
    
    transaction_id = params.get("id")
    reason = params.get("reason")
    
    # Find order by transaction ID
    orders = db.query(Order).filter(Order.notes.contains(str(transaction_id))).all()
    
    if not orders:
        return {
            "error": {
                "code": -31003,
                "message": "Transaction not found"
            },
            "id": request_id
        }
    
    order = orders[0]
    
    # Update order status
    order.status = "cancelled"
    
    # Update transaction state in notes
    if order.notes:
        order.notes = order.notes.replace('"state": 1', f'"state": -1, "cancel_reason": {reason}')
        order.notes = order.notes.replace('"state": 2', f'"state": -2, "cancel_reason": {reason}')
    
    db.commit()
    
    current_time = int(time.time() * 1000)
    
    return {
        "result": {
            "transaction": str(transaction_id),
            "cancel_time": current_time,
            "state": -2
        },
        "id": request_id
    }

def handle_check_transaction(params: dict, request_id: int, db: Session):
    """Check transaction status"""
    
    transaction_id = params.get("id")
    
    # Find order by transaction ID
    orders = db.query(Order).filter(Order.notes.contains(str(transaction_id))).all()
    
    if not orders:
        return {
            "error": {
                "code": -31003,
                "message": "Transaction not found"
            },
            "id": request_id
        }
    
    order = orders[0]
    
    # Parse transaction info from notes
    state = 1  # Default: created
    if order.status == "completed":
        state = 2
    elif order.status == "cancelled":
        state = -2
    
    current_time = int(time.time() * 1000)
    
    return {
        "result": {
            "create_time": current_time,
            "perform_time": current_time if state == 2 else 0,
            "cancel_time": current_time if state < 0 else 0,
            "transaction": str(transaction_id),
            "state": state,
            "reason": None
        },
        "id": request_id
    }

# Admin endpoint to check payment status
@router.get("/api/admin/payme/status/{order_id}")
async def get_payme_status(
    order_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get Payme payment status for order (admin only)"""
    
    order = db.query(Order).filter(Order.order_number == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Parse transaction info from notes
    transaction_info = None
    if order.notes and "[Payme Transaction]" in order.notes:
        try:
            json_str = order.notes.split("[Payme Transaction]")[1].strip().split("\n")[0]
            transaction_info = json.loads(json_str)
        except:
            pass
    
    return {
        "order_id": order_id,
        "order_status": order.status,
        "transaction_info": transaction_info
    }
