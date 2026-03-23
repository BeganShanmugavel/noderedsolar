from config import Config


def calculate_financials(actual_generation, maintenance_cost=None):
    maintenance = Config.DEFAULT_MAINTENANCE_COST if maintenance_cost is None else maintenance_cost
    revenue = actual_generation * Config.ELECTRICITY_RATE
    return {
        'revenue': revenue,
        'maintenance_cost': maintenance,
        'profit': revenue - maintenance,
    }
