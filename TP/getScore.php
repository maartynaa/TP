<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "login";

$conn = new mysqli($servername, $username, $password, $dbname);

$postdata = file_get_contents("php://input");

$request = json_decode($postdata);

if(isset($postdata) && !empty($postdata)) {
	$username = $request->username;
	$password = $request->password;
}





$result = mysqli_query($conn, "select * from ranking order by score")
			or die("Failed to query database ".mysqli_error());
			
$json_array = array();

while($row = mysqli_fetch_assoc($result)) {
	
	$json_array[] = $row;

}

echo json_encode($json_array);






?>