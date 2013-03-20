<?php

function curl_post_async($url, $params)
{
  foreach ($params as $key => &$val) {
    if (is_array($val)) $val = implode(',', $val);
      $post_params[] = $key.'='.urlencode($val);
  }
  $post_string = implode('&', $post_params);

  $parts=parse_url($url);

  $fp = fsockopen($parts['host'], 
    isset($parts['port'])?$parts['port']:80, 
    $errno, $errstr, 30);

  // pete_assert(($fp!=0), "Couldn't open a socket to ".$url." (".$errstr.")");

  $out = "POST ".$parts['path']." HTTP/1.1\r\n";
  $out.= "Host: ".$parts['host']."\r\n";
  $out.= "Content-Type: application/x-www-form-urlencoded\r\n";
  $out.= "Content-Length: ".strlen($post_string)."\r\n";
  $out.= "Connection: Close\r\n\r\n";
  if (isset($post_string)) $out.= $post_string;

  fwrite($fp, $out);
  fclose($fp);
}

function addUser ($userObj) {
  $sql = "INSERT INTO user (fb_id, email, liked, permissions) VALUES (:fb_id, :email, :liked, :permissions);";
  $db = getConnection();
  $stmt = $db->prepare($sql);
  $stmt->bindParam("fb_id", $userObj->id);
  $stmt->bindParam("email", $userObj->email);
  $stmt->bindParam("liked", $userObj->liked);
  $stmt->bindParam("permissions", $userObj->permissions);
  $stmt->execute();
  $result = $stmt->fetchAll(PDO::FETCH_OBJ);

  if ($result) {
    // Everything gone well
    return true;
  } else {
    // WHAT ?!?!? HOW IT IS POSSIBUL THAT ANYTHONG GOEN WROGN?
    return false;
  }
}

function requestExtendedAT ($facebook_lib) {
  /**
   * When requestExtendedAT receives AccessToken subsequent to a FBConnect, 
   * the generated token is NOT YET working on facebook servers!
   * We have to wait 5-10 seconds in order to let the AccessToken be valid,
   * THEN we query FB servers for informations!
   */
  sleep(5);
  // debug
  $file = "extendedAT_".$_REQUEST['id'].".txt";
  $data = json_encode($_REQUEST);
  file_put_contents($file, $data);

  $facebook_lib->setAccessToken($_REQUEST['short_access_token']);
  $fb_extendedAT = $facebook_lib->setExtendedAccessToken();

  $data = print_r($facebook_lib->getAccessToken(), true);
  file_put_contents($file, $data, FILE_APPEND);

  $fb_id = intval($_REQUEST['id']);
  $fql = array(
    "user_info" => sprintf("SELECT name, contact_email, is_app_user, birthday, current_location FROM user WHERE uid = '%s'", $fb_id)
  );
  $fb_response = $facebook_lib->api(array("method" => "fql.multiquery", "queries" => $fql));

  // debug
  $data = print_r($fb_response, true);
  file_put_contents($file, $data, FILE_APPEND);

  // Prepare SQL Data
  $sql_data = array(
    ":id" => $fb_id,
    ":name" => $fb_response[0]['fql_result_set'][0]['name'],
    ":contact_email" => $fb_response[0]['fql_result_set'][0]['contact_email'],
    ":birthday" => $fb_response[0]['fql_result_set'][0]['birthday'],
    ":current_location" => json_encode($fb_response[0]['fql_result_set'][0]['current_location']),
    ":liked" => intval($_REQUEST['liked']),
    ":permissions" => intval($fb_response[0]['fql_result_set'][0]['is_app_user']),
    ":short_access_token" => $_REQUEST['short_access_token'],
    ":extended_access_token" => $facebook_lib->getAccessToken()
  );
  // debug
  $data = print_r($sql_data, true);
  file_put_contents($file, $data, FILE_APPEND);
  $db = getConnection();
  // debug
  $data = print_r($db, true);
  file_put_contents($file, $data, FILE_APPEND);
  $pdo = $db->prepare("INSERT INTO fb_user (id, name, contact_email, birthday, current_location, liked, permissions, short_access_token, extended_access_token) 
    VALUES (:id, :name, :contact_email, STR_TO_DATE(:birthday,'%M %d, %Y'), :current_location, :liked, :permissions, :short_access_token, :extended_access_token) 
    ON DUPLICATE KEY UPDATE name = :name, contact_email = :contact_email, birthday = STR_TO_DATE(:birthday,'%M %d, %Y'), 
    current_location = :current_location, liked = :liked, permissions = :permissions, short_access_token = :short_access_token, extended_access_token = :extended_access_token");
  // $pdo should contain TRUE, means it worked successfully
  // debug
  $data = print_r($pdo, TRUE);
  file_put_contents($file, $data, FILE_APPEND);
  $pdo->execute($sql_data);
  // debug
  $data = print_r("I HAVE WRITTEN IN DATABASE", TRUE);
  file_put_contents($file, $data, FILE_APPEND);
}

function giveFBUserStatus () {
  // var_dump($_REQUEST);
  // Update Session
  $status = array(
    "permissions" => ($_REQUEST['status'] == "connected") ? 1 : 0
  );
  if (isset($_REQUEST['authResponse']['userID'])) { $status['id'] = intval($_REQUEST['authResponse']['userID']); }
  if (isset($_REQUEST['authResponse']['accessToken'])) { $status['short_access_token'] = $_REQUEST['authResponse']['accessToken']; }
  if (isset($_SESSION['fb_user']['liked'])) { $status['liked'] = intval($_SESSION['fb_user']['liked']); }

  $_SESSION['fb_user'] = array_merge((isset($_SESSION['fb_user'])) ? $_SESSION['fb_user'] : array(), $status);

  if (isset($status['permissions']) && $status['permissions'] == 1) {
    curl_post_async('https://sg.appinthecloud.it/api/extendedToken', $status);
  }
  // Returns session 
  return $_SESSION['fb_user'];
}

function sessionPrepare ($signed_request) {
  $signed_info = array(
    "page" => intval($signed_request['page']['id']),
    "liked" => intval($signed_request['page']['liked'])
  );
  // var_dump($signed_info);
  if (isset($_SESSION['fb_user']['id'])) {
    // $_SESSION['fb_user'] = statusResponse();
    $_SESSION['fb_user'] = array_merge($_SESSION['fb_user'], $signed_info);
  } else {
    $_SESSION['fb_user'] = $signed_info;
  }
  // if liked changed, commit to DB
}

function deauthUser ($signed_request) {
  if (isset($signed_request['user_id'])) {
    $sql = sprintf("UPDATE fb_user SET permissions = 0 WHERE id = %d", $signed_request['user_id']);
    $db = getConnection();
    // $pdo should contain 1, means it modified 1 record
    $pdo = $db->exec($sql);
  }
}



?>