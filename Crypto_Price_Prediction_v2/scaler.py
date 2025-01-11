from sklearn.discriminant_analysis import StandardScaler
from sklearn.preprocessing import MaxAbsScaler, MinMaxScaler, RobustScaler


def get_scaler(scaler):
  scalers = {
      "minmax": MinMaxScaler(),
      "standard": StandardScaler,
      "maxabs": MaxAbsScaler,
      "robust": RobustScaler,
  }
  return scalers.get(scaler.lower())