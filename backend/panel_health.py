
def analyze_panel_health(telemetry):
    panel_count = telemetry.get('panel_count', 0) or 1
    total = telemetry.get('actual_generation', 0)
    avg = total / panel_count
    weak_panels = []

    for panel in telemetry.get('panels', []):
        if panel.get('generation', 0) < 0.7 * avg:
            weak_panels.append(panel['panel_id'])

    return {'plant_average': avg, 'weak_panels': weak_panels}
