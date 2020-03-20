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





$result = mysqli_query($conn, "select * from user where username = '$username' and password = '$password'")
			or die("Failed to query database ".mysqli_error());
			
$row = mysqli_fetch_array($result);

if(isset($row) && !empty($row)) {
		if ($row['username'] == $username && $row['password'] == $password){
		echo json_encode(
				array(
					"message" => "Successful",
					"token" => 'Bearer-jsdfnkj223',
					"username" => $username,
					"expireAt" => $password
				));
		http_response_code(200);
		} else {
			echo json_encode(
					array(
						"message" => "Successful"
					));
			http_response_code(200);
			
		}
}
else {
echo json_encode(
					array(
						"message" => "Successful"
					));
			http_response_code(200);

}





?>