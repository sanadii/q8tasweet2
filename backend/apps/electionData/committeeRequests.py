def get_election_committees(connection):
    committees = []
    
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT 
                c.id as committee_id, c.name as committee_name, 
                c.serial as committee_serial, c.circle as committee_circle,
                c.area as committee_area, c.gender as committee_gender,
                c.description as committee_description, c.address as committee_address,
                c.voter_count as committee_voter_count, c.committee_count as committee_count,
                c.total_voters as total_voters, c.tag as committee_tag,
                sc.id as sub_committee_id, sc.areas as sub_committee_areas, 
                sc.letters as sub_committee_letters, sc.committee as sub_committee_committee,
                sc.main as sub_committee_main
            FROM committee c
            LEFT JOIN sub_committee sc ON c.id = sc.committee
            """
        )
        
        rows = cursor.fetchall()
        
        for row in rows:
            committee_id = row[0]
            committee_name = row[1]
            committee_serial = row[2]
            committee_circle = row[3]
            committee_area = row[4]
            committee_gender = row[5]
            committee_description = row[6]
            committee_address = row[7]
            committee_voter_count = row[8]
            committee_count = row[9]
            total_voters = row[10]
            committee_tag = row[11]
            
            sub_committee_id = row[12]
            sub_committee_areas = row[13]
            sub_committee_letters = row[14]
            sub_committee_committee = row[15]
            sub_committee_main = row[16]
            
            # Check if the committee is already in the list
            committee_index = next((index for (index, d) in enumerate(committees) if d["committee_id"] == committee_id), None)
            if committee_index is None:
                # If not, add it to the list
                committee = {
                    'committee_id': committee_id,
                    'committee_name': committee_name,
                    'committee_serial': committee_serial,
                    'committee_circle': committee_circle,
                    'committee_area': committee_area,
                    'committee_gender': committee_gender,
                    'committee_description': committee_description,
                    'committee_address': committee_address,
                    'committee_voter_count': committee_voter_count,
                    'committee_count': committee_count,
                    'total_voters': total_voters,
                    'committee_tag': committee_tag,
                    'sub_committees': []
                }
                committees.append(committee)
                committee_index = len(committees) - 1
            
            # Add subcommittee information to the list of subcommittees for the committee
            if sub_committee_id:
                sub_committee = {
                    'sub_committee_id': sub_committee_id,
                    'sub_committee_areas': sub_committee_areas,
                    'sub_committee_letters': sub_committee_letters,
                    'sub_committee_committee': sub_committee_committee,
                    'sub_committee_main': sub_committee_main
                }
                committees[committee_index]['sub_committees'].append(sub_committee)

    return committees
