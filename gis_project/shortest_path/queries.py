SQL_GET_IDS_FROM_LATLNG = '''SELECT source FROM ways WHERE (abs(x1-{lng}) < {precision} OR abs(x2-{lng}) < {precision})
                          AND (abs(y1-{lat}) < {precision} OR abs(y2-{lat}) < {precision});'''

SQL_GET_GEOM_FROM_IDS = '''SELECT seq, edge, length_m, ST_AsGEOJSON(w.the_geom)
        FROM pgr_dijkstra('
                SELECT gid as id, source, target,
                        length as cost FROM ways',
                {start}, {end}, false
        ) d INNER JOIN ways w
          ON d.edge = w.gid
        ORDER BY seq;'''
