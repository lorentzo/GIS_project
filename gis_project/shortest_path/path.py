from django.db import connection as conn

from .queries import SQL_GET_IDS_FROM_LATLNG, SQL_GET_GEOM_FROM_IDS


# Usage example:
#
# start, end = get_endpoints(45.798063, 15.966559, 45.808911, 15.948557)
# geojson_list = get_path_geometry(start, end)


def get_endpoints(lat1, lng1, lat2, lng2):
  start, end = None, None
  precision_start, precision_end = 0.00001, 0.00001
  lat1 = round(lat1, 6)
  lat2 = round(lat2, 6)
  lng1 = round(lng1, 6)
  lng2 = round(lng2, 6)

  with conn.cursor() as cursor:
    while not start:
      cursor.execute(SQL_GET_IDS_FROM_LATLNG.format(lat=lat1, lng=lng1, precision=precision_start))
      start = cursor.fetchone()
      precision_start += 0.00005
    start = start[0]

    while not end:
      cursor.execute(SQL_GET_IDS_FROM_LATLNG.format(lat=lat2, lng=lng2, precision=precision_end))
      end = cursor.fetchone()
      precision_end += 0.00005
    end = end[0]

  return start, end


def get_path_geometry(start, end):
  with conn.cursor() as cursor:
    cursor.execute(SQL_GET_GEOM_FROM_IDS.format(start=start, end=end))
    rows = cursor.fetchall()

  results = []
  length = 0.0
  for row in rows:
    results.append(row[3])
    length += float(row[2])

  return results, length
