instalare mongodb

in cmd "C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --dbpath path_catre_proiect\MPS_Project2\DataBase //prima e locatia mongod.exe

use Nume_Baza_de_date //mutare in baza de date
db.Nume_baza_de_date.find() // select * from Nume_baza_de_date

//insert
db.User.insert
	(
		{
			"ID" : 1112,
			"Username" : "Martin",
			"Password" : "123456",
			"Localitate" : "Bucuresti",
			"Varsta" : 30
		}
	)

//remove
db.User.remove({Username:"George",ID:1112});