import csv


def csv_loader(file_name):
    f = open(file_name, 'r', encoding='euc-kr')
    row = []
    rdr = csv.reader(f)
    for line in rdr:
        row.append(line)
    f.close()
    return row
