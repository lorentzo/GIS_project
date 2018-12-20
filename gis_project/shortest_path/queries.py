SQL_GET_IDS_FROM_LATLNG = '''select source from ways where (abs(x1-{lng}) < 0.005 or abs(x2-{lng}) < 0.005)
                          and (abs(y1-{lat}) < 0.005 or abs(y2-{lat}) < 0.005);'''

SQL_GET_GEOM_FROM_IDS = '''SELECT seq, edge, ST_AsGEOJSON(b.the_geom)
        FROM pgr_dijkstra('
                SELECT gid as id, source, target,
                        length as cost FROM ways',
                {start}, {end}, false
        ) a INNER JOIN ways b
          ON (a.edge = b.gid)
        ORDER BY seq;'''
