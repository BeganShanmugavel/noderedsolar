
def predict_fault(efficiency_values):
    if len(efficiency_values) < 5:
        return None

    trailing = efficiency_values[-5:]
    decreasing = all(a > b for a, b in zip(trailing, trailing[1:]))
    if not decreasing:
        return None

    latest = trailing[-1]
    if latest < 55:
        return 'Possible hardware failure'
    if latest < 75:
        return 'Inverter instability'
    return 'Panel degradation'
