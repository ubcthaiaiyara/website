"use client";

import { useRef } from "react";

const OTP_LENGTH = 6;

type Props = {
    id: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    label: string;
};

function clean(value: string): string {
    return value.replace(/\D/g, "").slice(0, OTP_LENGTH);
}

export default function OtpInput({ id, value, onChange, disabled, label }: Props) {
    const refs = useRef<Array<HTMLInputElement | null>>([]);
    const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? "");

    function focus(index: number) {
        refs.current[Math.max(0, Math.min(index, OTP_LENGTH - 1))]?.focus();
    }

    return (
        <div className="otp-field" role="group" aria-label={label}>
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(node) => {
                        refs.current[index] = node;
                    }}
                    id={index === 0 ? id : undefined}
                    className="otp-box"
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    pattern="[0-9]*"
                    maxLength={1}
                    required
                    disabled={disabled}
                    value={digit}
                    aria-label={`${label} digit ${index + 1}`}
                    onChange={(event) => {
                        const nextDigits = digits.slice();
                        const entered = clean(event.target.value);
                        if (!entered) {
                            nextDigits[index] = "";
                            onChange(nextDigits.join(""));
                            return;
                        }

                        for (let i = 0; i < entered.length && index + i < OTP_LENGTH; i += 1) {
                            nextDigits[index + i] = entered[i];
                        }
                        onChange(nextDigits.join(""));
                        focus(index + entered.length);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Backspace" && !digits[index] && index > 0) {
                            event.preventDefault();
                            const nextDigits = digits.slice();
                            nextDigits[index - 1] = "";
                            onChange(nextDigits.join(""));
                            focus(index - 1);
                        }
                        if (event.key === "ArrowLeft") {
                            event.preventDefault();
                            focus(index - 1);
                        }
                        if (event.key === "ArrowRight") {
                            event.preventDefault();
                            focus(index + 1);
                        }
                    }}
                    onPaste={(event) => {
                        event.preventDefault();
                        const pasted = clean(event.clipboardData.getData("text"));
                        if (!pasted) return;
                        const nextDigits = digits.slice();
                        for (let i = 0; i < pasted.length && index + i < OTP_LENGTH; i += 1) {
                            nextDigits[index + i] = pasted[i];
                        }
                        onChange(nextDigits.join(""));
                        focus(index + pasted.length);
                    }}
                />
            ))}
        </div>
    );
}
