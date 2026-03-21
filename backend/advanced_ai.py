from statistics import mean


def derive_ai_insights(window):
    if not window:
        return {
            'degradation_risk_score': 0,
            'predicted_next_failure_hours': None,
            'cleaning_priority_index': 0,
            'confidence_band': {'low': 0, 'high': 0},
            'unique_flags': [],
        }

    generation = [max(r.get('actual_generation', 0), 0) for r in window]
    voltage = [r.get('voltage', 0) for r in window]
    temperature = [r.get('temperature', 0) for r in window]
    irradiation = [max(r.get('irradiation', 1), 1) for r in window]

    gen_ratio = mean(generation) / max(mean(irradiation), 1)
    thermal_stress = max(0, mean(temperature) - 32)
    voltage_spread = max(voltage) - min(voltage) if len(voltage) > 1 else 0

    degradation_risk = min(100, round(45 * (1 - min(gen_ratio, 1)) + thermal_stress * 2 + voltage_spread * 0.3, 2))
    cleaning_priority = min(100, round((1 - min(gen_ratio, 1)) * 100 + max(0, mean(temperature) - 30), 2))

    if degradation_risk >= 75:
        failure_hours = 72
    elif degradation_risk >= 50:
        failure_hours = 168
    else:
        failure_hours = 336

    avg_gen = mean(generation)
    band = {
        'low': round(avg_gen * 0.9, 2),
        'high': round(avg_gen * 1.1, 2),
    }

    flags = []
    if voltage_spread > 20:
        flags.append('inverter_instability_signal')
    if mean(temperature) > 35:
        flags.append('thermal_derating_risk')
    if gen_ratio < 0.75:
        flags.append('soiling_or_degradation_pattern')

    return {
        'degradation_risk_score': degradation_risk,
        'predicted_next_failure_hours': failure_hours,
        'cleaning_priority_index': cleaning_priority,
        'confidence_band': band,
        'unique_flags': flags,
    }
