#
# Electors By Gender
#
def count_electors_by_gender(connection):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT SUM(CASE WHEN gender = 1 THEN 1 ELSE 0 END) AS maleElectors,
                   SUM(CASE WHEN gender = 2 THEN 1 ELSE 0 END) AS femaleElectors
            FROM elector
            """
        )
        result = cursor.fetchone()

    return result if result else (0, 0)


#
# Electors By Last Name
#
def count_electors_by_last_name(connection):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT last_name, COUNT(*) AS count
            FROM elector
            GROUP BY last_name
            ORDER BY count DESC
            """
        )
        elector_by_family_data = cursor.fetchall()

    return elector_by_family_data


#
# Electors By Area
#
def count_electors_by_area(connection):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT area, COUNT(*) AS count
            FROM elector
            GROUP BY area
            ORDER BY count DESC
            """
        )
        elector_by_area_data = cursor.fetchall()

    return elector_by_area_data
