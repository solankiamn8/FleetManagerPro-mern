export default function LicensePlate({ value }) {
  if (!value) return null

  return (
    <span className="license-plate">
      {/* IND section */}
      <span className="license-plate-ind">
        <span className="license-plate-ind-dot" />
        <span className="license-plate-ind-text">IND</span>
      </span>

      {/* Number */}
      <span className="license-plate-number">
        {value}
      </span>
    </span>
  )
}
