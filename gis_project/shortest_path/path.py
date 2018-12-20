from django.db import connection as conn

from .queries import SQL_GET_IDS_FROM_LATLNG, SQL_GET_GEOM_FROM_IDS
from django.db import connection as conn

from .queries import SQL_GET_IDS_FROM_LATLNG, SQL_GET_GEOM_FROM_IDS


# Usage example:
#
# start, end = get_endpoints(45.798063, 15.966559, 45.808911, 15.948557)
# geojson_list = get_path_geometry(start, end)

# TODO zamjenit parametre s dva Point-a?
def get_endpoints(lat1, lng1, lat2, lng2):
  start, end = 0, 0
  with conn.cursor() as cursor:
    cursor.execute(SQL_GET_IDS_FROM_LATLNG.format(lat=lat1, lng=lng1))
    start = cursor.fetchone()[0]
    cursor.execute(SQL_GET_IDS_FROM_LATLNG.format(lat=lat2, lng=lng2))
    end = cursor.fetchone()[0]

  return start, end


def get_path_geometry(start, end):
  with conn.cursor() as cursor:
    cursor.execute(SQL_GET_GEOM_FROM_IDS.format(start=start, end=end))
    rows = cursor.fetchall()

  results = []
  for row in rows:
    results.append(row[2])

  return results
