import csv

with open('final_football_manager_countries.csv', mode='r') as country_dict:
    with open('dataset.csv', mode='r', encoding='utf-8') as dataset:
        country_reader = csv.DictReader(country_dict)
        player_reader = csv.DictReader(dataset)
        countries = {}

        line_count = 1
        for country in country_reader:
            countries[country['FM17ID']] = country['Alpha_3']
            line_count += 1

        player_count = 0
        error_country = []
        player_reader.fieldnames.append('CountryCode')
        writer = csv.DictWriter(open('new_dataset.csv', 'w', encoding='utf-8', newline=''),
                                fieldnames=player_reader.fieldnames,)
        writer.writeheader()
        for player in player_reader:
            if player['NationID'] not in countries and player['NationID'] not in error_country:
                error_country.append(player['NationID'])
            else:
                player['CountryCode'] = countries[player['NationID']]
                writer.writerow(player)
                player_count += 1


        print(error_country)
        print(f'Processed {line_count} countries.')
        print(f'Processed {player_count} players.')

