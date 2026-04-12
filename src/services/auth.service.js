import generateOTP from "../utils/generateOtp";
import{ sendOTP } from "./emailService";

const otpStore = {};

async function requestOTP(email) {
  const otp = generateOTP();

  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  await sendOTP(email, otp);
}

function verifyOTP(email, otp) {
  const record = otpStore[email];

  if (!record) return false;
  if (Date.now() > record.expiresAt) return false;

  return record.otp === otp;
}

export default { requestOTP, verifyOTP };