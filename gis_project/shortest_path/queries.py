SQL_GET_IDS_FROM_LATLNG = '''select source from ways where (abs(x1-{lat}) < 0.0005 or abs(x2-{lat}) < 0.0005)
                          and (abs(y1-{lng}) < 0.0005 or abs(y2-{lng}) < 0.0005);'''

SQL_GET_GEOM_FROM_IDS = '''SELECT seq, edge, b.the_geom
        FROM pgr_dijkstra('
                SELECT gid as id, source, target,
                        length as cost FROM ways',
                {start}, {end}, false
        ) a INNER JOIN ways b ON (a.edge = b.gid) ORDER BY seq;'''
