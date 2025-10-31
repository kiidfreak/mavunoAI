"""
SMS service for sending templated notifications via Africa's Talking.
"""

from __future__ import annotations

import os
from datetime import datetime
from typing import Any, Dict, Optional

import requests


class SMSService:
    """Utility for sending SMS notifications through Africa's Talking."""

    def __init__(self) -> None:
        self.api_key = os.getenv("AT_API_KEY")
        self.username = os.getenv("AT_USERNAME", "sandbox")
        self.sender_id = os.getenv("AT_SENDER_ID", "Mavuno")
        self.api_url = os.getenv(
            "AT_SMS_URL", "https://api.africastalking.com/version1/messaging"
        )

    # ------------------------------------------------------------------
    # Public helpers
    # ------------------------------------------------------------------
    def send_welcome_message(
        self,
        phone_number: str,
        name: Optional[str] = None,
        location: Optional[str] = None,
        language: Optional[str] = None,
    ) -> Dict[str, Any]:
        greeting_name = name or "Farmer"
        location_line = f" in {location}" if location else ""
        language_line = f" Language set: {language.title()}" if language else ""

        message = (
            f"Karibu {greeting_name}!"  # "Welcome" in Swahili keeps it friendly
            f" MavunoAI is ready to support your farm{location_line}."
            f" Dial *384*717118# anytime for tips.{language_line}"
        )
        return self._dispatch(phone_number, message, tag="welcome")

    def send_farm_summary(
        self,
        phone_number: str,
        summary: Dict[str, Any],
    ) -> Dict[str, Any]:
        farm = summary.get("farm_name") or summary.get("location") or "your farm"
        crop = summary.get("crop")
        moisture = summary.get("soil_moisture")
        rainfall = summary.get("rainfall_mm")
        next_action = summary.get("next_action")

        lines = [f"MavunoAI update for {farm}:"]
        if crop:
            lines.append(f"Crop: {crop}")
        if moisture is not None:
            lines.append(f"Soil moisture: {moisture:.0f}%")
        if rainfall is not None:
            lines.append(f"Rain (30d): {rainfall}mm")
        if next_action:
            lines.append(f"Next action: {next_action}")
        lines.append("Dial *384*717118# for details.")

        return self._dispatch(phone_number, "\n".join(lines), tag="farm-summary")

    def send_loan_update(
        self,
        phone_number: str,
        loan_info: Dict[str, Any],
    ) -> Dict[str, Any]:
        status = loan_info.get("status", "Pending")
        amount = loan_info.get("amount")
        due_date = loan_info.get("due_date")
        next_step = loan_info.get("next_step")

        amount_line = f"KES {amount:,.0f}" if isinstance(amount, (int, float)) else str(amount or "")
        due_line = (
            f"Due: {due_date}" if isinstance(due_date, str) else ""
        )

        message_parts = ["MavunoAI loan update:"]
        message_parts.append(f"Status: {status}")
        if amount_line:
            message_parts.append(f"Amount: {amount_line}")
        if due_line:
            message_parts.append(due_line)
        if next_step:
            message_parts.append(f"Next step: {next_step}")
        message_parts.append("Need help? Dial *384*717118#.")

        return self._dispatch(phone_number, "\n".join(filter(None, message_parts)), tag="loan")

    def send_reward_notification(
        self,
        phone_number: str,
        reward: Dict[str, Any],
    ) -> Dict[str, Any]:
        milestone = reward.get("milestone", "Milestone achieved")
        partner = reward.get("partner", "our agrovet partner")
        coupon = reward.get("coupon_code")
        expiry = reward.get("expires_at")

        message_parts = [f"Congrats! {milestone}."]
        if partner:
            message_parts.append(f"Redeem at {partner}.")
        if coupon:
            message_parts.append(f"Show code: {coupon}")
        if expiry:
            message_parts.append(f"Valid until: {expiry}")
        message_parts.append("Dial *384*717118# for more offers.")

        return self._dispatch(phone_number, "\n".join(message_parts), tag="reward")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------
    def _is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.lower() != "your_api_key_here")

    def _dispatch(self, phone_number: str, message: str, tag: str) -> Dict[str, Any]:
        """Send the SMS or log it if the gateway isn't configured."""

        payload: Dict[str, Any] = {
            "phone_number": phone_number,
            "message": message,
            "tag": tag,
            "timestamp": datetime.utcnow().isoformat(),
        }

        if not self._is_configured():
            print("[SMS-LOCAL]", payload)
            payload.update(
                {
                    "success": True,
                    "note": "Africa's Talking credentials missing; message logged only.",
                }
            )
            return payload

        headers = {
            "apiKey": self.api_key,
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        }
        data = {
            "username": self.username,
            "to": phone_number,
            "message": message,
            "from": self.sender_id,
        }

        try:
            response = requests.post(self.api_url, headers=headers, data=data, timeout=10)
            payload["status_code"] = response.status_code
            if response.status_code in {200, 201}:
                payload["success"] = True
                payload["response"] = self._safe_json(response)
            else:
                payload["success"] = False
                payload["error"] = response.text
        except Exception as exc:  # pragma: no cover - network failure path
            payload["success"] = False
            payload["error"] = str(exc)

        return payload

    @staticmethod
    def _safe_json(response: requests.Response) -> Any:
        try:
            return response.json()
        except ValueError:
            return response.text
