from datetime import datetime


def create_alert(site_identifier, alert_type, message, severity='Medium'):
    return {
        'site_identifier': site_identifier,
        'timestamp': datetime.utcnow().isoformat(),
        'alert_type': alert_type,
        'severity': severity,
        'message': message,
    }
