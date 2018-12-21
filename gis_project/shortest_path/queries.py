SQL_GET_IDS_FROM_LATLNG = '''select source from ways where (abs(x1-{lng}) < {precision} or abs(x2-{lng}) < {precision})
                          and (abs(y1-{lat}) < {precision} or abs(y2-{lat}) < {precision});'''

SQL_GET_GEOM_FROM_IDS = '''SELECT seq, edge, length_m, ST_AsGEOJSON(b.the_geom)
        FROM pgr_dijkstra('
                SELECT gid as id, source, target,
                        length as cost FROM ways',
                {start}, {end}, false
        ) a INNER JOIN ways b
          ON (a.edge = b.gid)
        ORDER BY seq;'''
