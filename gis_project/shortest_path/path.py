from django.db import connection as conn

from .queries import SQL_GET_IDS_FROM_LATLNG, SQL_GET_GEOM_FROM_IDS


# TODO zamjenit parametre s dva Point-a?
def get_endpoints(lat1, lng1, lat2, lng2):
  start, end = 0, 0
  with conn.cursor() as cursor:
    cursor.execute(SQL_GET_IDS_FROM_LATLNG.format(lat=lat1, lng=lng1))
    start = cursor.fetchone()
    cursor.execute(SQL_GET_IDS_FROM_LATLNG.format(lat=lat2, lng=lng2))
    end = cursor.fetchone()

  return start, end


def get_path_geometry(start, end):
  with conn.cursor() as cursor:
    cursor.execute(SQL_GET_GEOM_FROM_IDS.format(start=start, end=end))
    rows = cursor.fetchall()

  # TODO see what data we need and don't need
  return rows
