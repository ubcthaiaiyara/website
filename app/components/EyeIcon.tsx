// Show/hide-password icon. When the password is visible (`open`) it shows an
// open eye; when the password is hidden it shows a closed eye (a lowered eyelid
// with lashes), signalling that the value is concealed.
export default function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3.2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 9c2.5 3.5 6 5.5 10 5.5S19.5 12.5 22 9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 12.5 3 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.5 14.5 8 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15.5 14.5 16 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M20 12.5 21 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
