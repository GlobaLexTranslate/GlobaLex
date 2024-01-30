import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

let call;
let callAgent;

const calleePhoneInput = document.getElementById("callee-phone-input");
const callPhoneButton = document.getElementById("call-phone-button");
const hangUpPhoneButton = document.getElementById("hang-up-phone-button");

async function init() {
    const callClient = new CallClient();
    const tokenCredential = new AzureCommunicationTokenCredential('eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwNUVCMzFEMzBBMjBEQkRBNTMxODU2MkM4QTM2RDFCMzIyMkE2MTkiLCJ4NXQiOiJZRjZ6SFRDaURiMmxNWVZpeUtOdEd6SWlwaGsiLCJ0eXAiOiJKV1QifQ.eyJza3lwZWlkIjoiYWNzOmJlYjI4OWZjLWJhODUtNDYwOC04Mzg3LTMyNTViNGZiMDdhYV8wMDAwMDAxZC1mODk3LTU5NGItMGNmOS05YzNhMGQwMDc0YzgiLCJzY3AiOjE3OTIsImNzaSI6IjE3MDY1OTAzMTkiLCJleHAiOjE3MDY2NzY3MTksInJnbiI6ImFtZXIiLCJhY3NTY29wZSI6InZvaXAiLCJyZXNvdXJjZUlkIjoiYmViMjg5ZmMtYmE4NS00NjA4LTgzODctMzI1NWI0ZmIwN2FhIiwicmVzb3VyY2VMb2NhdGlvbiI6InVuaXRlZHN0YXRlcyIsImlhdCI6MTcwNjU5MDMxOX0.OT2h6Yux_jscacGjinBBWMOirUMn-Yg15aFLeP3-JXe7QWi2E5dEbbpLMEO273rjl0i7s4HhE1NPw3PTFYPO8etJSGnJK4fV2jFPGSxbkbXUadqWvMSFZ_8Gi2gCzl_lc7FjGoQ94WHSKi31oYNvsMLSC8geH6n-T0GqHM68wbW2J2C0sIBA7aq5Twv05I1Od0ZYpAowAxCCs6uw2nu1IShq989MGDtjD516vci4jOPCHj0n8g4C4TNpHwFXsj7nx-OumkI9eGM1yBgKTMt3-UONSm4eOcbiLY8m7HPQRJM1hWIxwbGKPkVzfyQxpc7AG_Dc0utC9ZJpKpnJ4hakvA');
    callAgent = await callClient.createCallAgent(tokenCredential);
    //callPhoneButton.disabled = false;
}

init();

callPhoneButton.addEventListener("click", () => {
    // start a call to phone
    const phoneToCall = calleePhoneInput.value;
    call = callAgent.startCall(
      [{phoneNumber: phoneToCall}], { alternateCallerId: {phoneNumber: 'YOUR AZURE REGISTERED PHONE NUMBER HERE: +12223334444'}
    });
    // toggle button states
    hangUpPhoneButton.disabled = false;
    callPhoneButton.disabled = true;
});

hangUpPhoneButton.addEventListener("click", () => {
// end the current call
call.hangUp({
    forEveryone: true
});

// toggle button states
hangUpPhoneButton.disabled = true;
callPhoneButton.disabled = false;
});