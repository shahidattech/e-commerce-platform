<?php 
error_reporting(E_ERROR | E_WARNING | E_PARSE);

function getHomePageConfigData($contentType,$dataType,$countryCode)
{
	global $mediaserver;
	global $webapiserver;	    
	
	$mediaServer= "{$mediaserver}resource/downloadfile";
	$apiData = "{$webapiserver}{$contentType}/{$dataType}?countryCode={$countryCode}";
	$apiDataContents = file_get_contents($apiData);
	$ApidataContentdecoded = json_decode($apiDataContents);
	$apiDataArrays = $ApidataContentdecoded->result;      
	return $apiDataArrays[0];
}

	
/* get country name  */
function getCountries()
{
	$countries = array('US Edition','Australia','Canada','China','France','Germany','Hong Kong','India','Italy','Japan','Korea','Middle East','Southeast Asia','Spain','United Kingdom');
	
	foreach($countries as $country_name):
		echo "<div class='item'>".$country_name."</div>";
	endforeach; 	
	
}

/** sort array with POS **/
function sortPos($mainArray){
	
	$pos = array_column($mainArray, 'pos');
	array_multisort($pos, SORT_ASC, $mainArray);
	return $mainArray;
}
/** sort array with POS **/
/** To get Parameter from URL  */

function getParam($url_param)
{
	
	if(count($url_param) > 1){	
		foreach ($url_param as $get_key => $get_value) {
		  $slideshows_params[] = $get_key."=".$get_value;	  
		}
		$slideshows_param = implode ("&", $slideshows_params);
		return "?".$slideshows_param;
	}else{
	  	foreach ($url_param as $get_keys => $get_values) {
		$slideshows_param = $get_keys."=".$get_values;
	  	}
	  	return "?".$slideshows_param;
	}
}
// character limit function
function custom_echo($x, $length)
{
  if(strlen($x)<=$length)
  {
    echo $x;
  }
  else
  {
    $y=substr($x,0,$length) . '...';
    echo $y;
  }
}
function getParamId($url_param)
{
	if(is_array($url_param)):
	foreach ($url_param as $get_key => $get_value) {
		  $slideshows_params = $get_value;	  
		}
	endif;	
	return $slideshows_params;
}


function getCurrentPage()
{
	$filename = getCurrentFile();
	$current_file_name = strstr($filename, '.', true);
	return  str_replace('-', ' ', $current_file_name);
}

/** Using UNIX way to get file name **/

function getCurrentFile()
{
	$parsedUrl = parse_url($_SERVER['REQUEST_URI']);
    return basename($parsedUrl["path"]);
}

/**  pass array key as name of category and link as value  */ 
function getBreadcrums()
{ 
	global $path;
?>
<div class="container bread_crum">
	<ul class="bread_crum_links">	
<?php

	global $art_market_new_true,$Reviews_true,$VA_Auctions_true,$Fairs_true,$Galleries_true,$Museums_true,$VA_Features_true,$Travel_Venues_az_true,$news;
	$all_parameter = array(
							'art-market-news'=>$art_market_new_true,
							'reviews'=>$Reviews_true,
							'auctions'=>$VA_Auctions_true,
							'fairs'=>$Fairs_true,
							'galleries'=>$Galleries_true,
							'museums'=>$Museums_true,
							'features'=>$VA_Features_true,
							'venues'=>$Travel_Venues_az_true,
							'calendar'=>$news,
							'slideshows'=>$news,

					);
	

	if($location = substr(dirname($_SERVER['REQUEST_URI']), 1)):
		$dirlist = explode('/', $location);
	else:
		$dirlist = array();
	endif;
	// getting current file name 
	$split_path_parts = pathinfo($_SERVER['REQUEST_URI']);
	
	$count = array_push($dirlist, basename($_SERVER['REQUEST_URI']));
	//$fileName = explode(".",$dirlist[$count-1]);
	//print_r(link2text($fileName[0]));  // last file name 

	//$address = 'http://'.$_SERVER['HTTP_HOST']."/newbai/WebsiteClinet";
	$address = rtrim($path, '/');

	//echo $location = end(explode('/', $location));

	if($location != "website" || $location != "tags"):		// temp code to avoid breadcrum on homepage
		// echo '<li><a href="'.$address.'">Home</a></li>';

		for($i = 2; $i < $count; $i++){
			if (strpos($dirlist[$i], '.php') == false){
				if(count($dirlist) == 3 || $i>2){$arrow = "";}else{$arrow = " > ";}
				$breadcrum_url = ($address .= '/'.$dirlist[$i]).'/'.$dirlist[$i].'.php'.$all_parameter[$dirlist[$i]];	
			echo '<li><a href="'.$breadcrum_url.'" >'.link2text($dirlist[$i]).$arrow.'</a></li>';
			}

		}
		//echo "<li>".$split_path_parts['filename']."</li>";  // printing current file 
	endif;	
?>
	</ul>
</div>
<?php } ?>

<?php 
		
		/** 
			Fucntion will get parameter from URL 
			getOneParam needs one parameter and getTwoParam needs two parameter
				
		**/

		function getOneParam($flag1)
		{
			//$flag1= $_GET[$flag1];
		    $flag1_val = $_GET[$flag1];
		    $param = "?".$flag1."=".$flag1_val;
		    return $param;
		    
		}

		function getTwoParam($flag1,$flag2)
		{
			//$flag1= $_GET[$flag1];
		    $flag1_val = $_GET[$flag1];
		    $flag2_val = $_GET[$flag2];		
			$param = "?".$flag1."=".$flag1_val."&".$flag2."=".$flag1_val;
			return $param;
		    
		}
		
		/** 
			getApiData Fucntion will give array with data
			example :--

			$aa = array('news_flag');
			$bb = array('news_flag','Contemporary_true');
			
			getApiData('article','getarticleSelectCategory',$aa);

			$aa will be an array with one flag && two flag below
		
		**/

		function getApiData($contentType,$dataType,$flag)
		{
		 	global $mediaserver;
		    global $webapiserver;	    
		  	
		  	$mediaServer= "{$mediaserver}resource/downloadfile";
		    $apiData = "{$webapiserver}{$contentType}/{$dataType}{$flag}";
		    $apiDataContents = file_get_contents($apiData);
		    $ApiContentdecoded = json_decode($apiDataContents);
		     
		    switch ($dataType) {
		     	case "getMicroSiteVenueArticles":
		     		$returnArray =  $ApiContentdecoded;
		     		break;
		     	case "getMicroSiteVenueSlideShow":
		     		$returnArray =  $ApiContentdecoded;
		     		break;
		     	case "getMicroSiteVenueEvent":
		     		$returnArray =  $ApiContentdecoded;
		     		break;
		     	case "getMicroSiteVenueArtWork":
		     		$returnArray =  $ApiContentdecoded;
		     		break;
		     	case "getArtworkByArtworkId":
		     		$returnArray =  $ApiContentdecoded;
		     		break;
		     	default:
		     		$returnArray =  $ApiContentdecoded->result;
		     		break;
		     }
		    if(!empty($ApiContentdecoded)): 
		    	return  $returnArray;
			else:
				echo "<div class='container'><h2>No Data</h2></div>";
			endif;	
		      
		}


/** getvenueById() **/
function getVenueById($contentType,$dataType,$flag)
		{
		 	global $mediaserver;
		    global $webapiserver;	    
		  	
		  	$mediaServer= "{$mediaserver}resource/downloadfile";
		    $apiData = "{$webapiserver}{$contentType}/{$dataType}{$flag}";
		    $apiDataContents = file_get_contents($apiData);
		    $ApiContentdecoded = json_decode($apiDataContents);
		     
		    return  $ApiContentdecoded;
		      
		}
			
/** getvenueById() **/
		




		function getTitle($dataArray)
		{
			return $dataArray->title;
		}
		function getTitleSlideshow($dataArray)
		{
			return $dataArray->title;
		}
		
		function getShortTitle($dataArray)
		{
			return $dataArray->short_title;
		}
		function getslideshowShortTitle($dataArray)
		{
			return $dataArray->shortTitle;
		}
		function getSummary($dataArray)
		{
			return $dataArray->summary;
		}
		function getDescription($dataArray)
		{
			$description = substr($dataArray->description_caption,0,60);
			return $description;

		}
		function getDescriptionSlideshow($dataArray)
		{
				$description = substr($dataArray->description,0,30);
			return $description;
		}
		/** 
			task 	  : get content type id
			parameter : content type array 
		**/
		function getId($dataArray)
		{
			return $dataArray->_id;
		}

		function getContentId($dataArray)
		{
			return $dataArray->ContentId;
		}

		// date formatter funciton 
		function getFormattedDate($unformattedDate)
		{
			$galleryDate = date('M d, Y',strtotime($unformattedDate));
			return $galleryDate;
		}
			// date formatter funciton 
		function getFormattedDate2($unformattedDate)
		{
			$galleryDate = date('M  d',strtotime($unformattedDate));
			return $galleryDate;
		}
		function getAddedDate($dataArray)
		{
			return $newDate = getFormattedDate($dataArray->added_date);

		}
		function getAddedDateEvents($dataArray)
		{
			return $newDate = getFormattedDate($dataArray->field_event_date);

		}

		function VenuesDetailDate($dataArray)
		{
			$field_event_date = getFormattedDate($dataArray->field_event_date);
			$field_event_date_to = getFormattedDate($dataArray->field_event_date_to);

			echo date('F d',strtotime($field_event_date)).' - '.date('F d, Y',strtotime($field_event_date_to));

		}

		// date formatter funciton 
		function getEventDetailDate($dataArray)
		{
			$field_event_date = getFormattedDate($dataArray->field_event_date);
			$field_event_date_to = getFormattedDate($dataArray->field_event_date_to);

			//echo date('d F',strtotime($field_event_date)).' - '.date('d F, Y',strtotime($field_event_date_to));
			if(empty($field_event_date_to)):
				echo date('M d, Y',strtotime($field_event_date));
			else:		
				echo date('M d',strtotime($field_event_date)).' - '.date('M d, Y',strtotime($field_event_date_to));
			endif;

		}

		/** Function to get Enabled value in a array */
		
		function getEnabledValue($dataArray)
		{
			if(is_array($dataArray)){
				foreach ($dataArray[0] as $key => $value){
					if($value == 1):
						$getSubChannel[] = $key;
					endif;	
				}
			}
			if(!empty($getSubChannel))
			{
				return implode (" , ", $getSubChannel);
			}
			
		}

		/** To Get Channel and SubChannels of any articles | start */

		function getSubChannel($dataArray)
		{
			
			
			$categ_genu_res = getEnabledValue($dataArray->genu_res);
			$categ_sub_subs = getEnabledValue($dataArray->sub_subs);			
			$categ_sub_channel = getEnabledValue($dataArray->sub_channel);
			$categ_ArchitectureSubs = getEnabledValue($dataArray->ArchitectureSubs);
			$categ_ArchitectureChannels = getEnabledValue($dataArray->ArchitectureChannels);
			$categ_PerformanceChannels = getEnabledValue($dataArray->PerformanceChannels);
			$categ_PerformanceSubs = getEnabledValue($dataArray->PerformanceSubs);			
			$categ_LifesytlesChannels = getEnabledValue($dataArray->LifesytlesChannels);
			$categ_LifesytlesSubs = getEnabledValue($dataArray->LifesytlesSubs);
			$categ_FashionChannels = getEnabledValue($dataArray->FashionChannels);
			$categ_FashionSubs = getEnabledValue($dataArray->FashionSubs);			
			$categ_TravelChannels = getEnabledValue($dataArray->TravelChannels);
			$categ_TravelSubs = getEnabledValue($dataArray->TravelSubs);
			$categ_eventvisualarts = getEnabledValue($dataArray->visual_arts);			
			
			/** for events visual ars  **/
			if(!empty($categ_eventvisualarts)){
				return $categ_eventvisualarts;
			}
			/** for visual arts catgory */
			if(!empty($categ_genu_res))
			{
				return $categ_genu_res;
			}elseif(!empty($categ_sub_subs))
			{
				return $categ_sub_subs;
			}elseif(!empty($categ_sub_channel))
			{
				return $categ_sub_channel;
			}

			/** for Architecture & design  */
			if(!empty($categ_ArchitectureSubs))
			{
				return $categ_ArchitectureSubs;
			}elseif(!empty($categ_ArchitectureChannels))
			{
				return $categ_ArchitectureChannels;

			}
			
			/** for Performing Arts  */
			if(!empty($categ_PerformanceSubs))
			{
				return $categ_PerformanceSubs;
			}elseif(!empty($categ_PerformanceChannels))
			{
				$categ_PerformanceChannels;

			}

			/** for Lifestyles  */
			if(!empty($categ_LifesytlesSubs))
			{
				return $categ_LifesytlesSubs;
			}elseif(!empty($categ_LifesytlesChannels))
			{
				return $categ_LifesytlesChannels;

			}

			/** for Fashion  */
			if(!empty($categ_FashionSubs))
			{
				return $categ_FashionSubs;
			}elseif(!empty($categ_FashionChannels))
			{
				return $categ_FashionChannels;

			}

			/** for Travel+culture  */
			if(!empty($categ_TravelSubs))
			{
				return $categ_TravelSubs;
			}elseif(!empty($categ_TravelChannels))
			{
				return $categ_TravelChannels;

			}

		}
/** To Get Channel and SubChannels of any articles | end */	


/** To get Art Market News Category **/
		
function gettopCategrory($dataArray){
	
	
	// main channel name

	//getting all category sub-cat sub-sub-categories names 
	 // visual arts 
	 $categ_genu_res = strtolower(getEnabledValue($dataArray->genu_res));
	 $categ_sub_subs = strtolower(getEnabledValue($dataArray->sub_subs));			
	 $categ_sub_channel = strtolower(getEnabledValue($dataArray->sub_channel));
	 // architecture & design
	 $categ_ArchitectureSubs = strtolower(getEnabledValue($dataArray->ArchitectureSubs));
	 $categ_ArchitectureChannels = strtolower(getEnabledValue($dataArray->ArchitectureChannels));
	 // performing-arts
	 $categ_PerformanceChannels = strtolower(getEnabledValue($dataArray->PerformanceChannels));
	 $categ_PerformanceSubs = strtolower(getEnabledValue($dataArray->PerformanceSubs));
	 // lifestyle
	 $categ_LifesytlesChannels = strtolower(getEnabledValue($dataArray->LifesytlesChannels));
	 $categ_LifesytlesSubs = strtolower(getEnabledValue($dataArray->LifesytlesSubs));
	 // fashion
	 $categ_FashionChannels = strtolower(getEnabledValue($dataArray->FashionChannels));
	 $categ_FashionSubs = strtolower(getEnabledValue($dataArray->FashionSubs));			
	 // travel
	 $categ_TravelChannels = strtolower(getEnabledValue($dataArray->TravelChannels));
	 $categ_TravelSubs = strtolower(getEnabledValue($dataArray->TravelSubs));
	//getting all category sub-cat sub-sub-categories names


	global $path,$Per_Music_true,$Per_Film_true,$Theater_Dance_per_true,$Per_Television_true,$Lifestyle_Food_Wine_true,$Lifestyle_Autos_Boats_true,$Arc_Architecture_true,$Arc_Design_true,$Arc_Home_Interiors_true,$Opera_per_true,$Travel_People_true,$Travel_Inspiration_true,$Travel_Destinations_article_true,$art_market_new_true,$Reviews_true,$VA_fairs_All_true,$Galleries_News_true,$Galleries_true,$Galleries_Reviews_true,$Museums_News_true,$Museums_Reviews_true;

	global 	$VA_Reviews_Antiquities_true,$VA_Reviews_Contemporary_true,$VA_Reviews_Impressionism_true,$VA_Reviews_Old_Masters_true,$VA_Reviews_Traditional_true,
			$VA_Auctions_true,$Auctions_News_true,$Auctions_Previews_true,$Auctions_true_slideshow,$VA_Auctions_Auction_House_true,
			$Fairs_News_true;	



			
	$param = array(
				
				'antiquities'=>$VA_Reviews_Antiquities_true,
				'contemporary art'=>$VA_Reviews_Contemporary_true,
				'impressionism & modern art'=>$VA_Reviews_Impressionism_true,
				'old masters & renaissance'=>$VA_Reviews_Old_Masters_true,
				'traditional'=>$VA_Reviews_Traditional_true,
				'auctions'=>$VA_Auctions_true,
				'auctions house'=>$VA_Auctions_Auction_House_true

	);
	
	switch ($categ_sub_channel) {
			case 'fairs':
				$fairs = array('news'=>$Fairs_News_true);
				break;
			case 'auctions':
				$param = array('news'=>$Auctions_News_true,'previews'=>$Auctions_Previews_true);
				break;
			case 'galleries':
				$param = array('news'=>$Galleries_News_true,'previews'=>$Galleries_Reviews_true,);
				break;
			case 'museums':
				$param = array('news'=>$Museums_News_true,'reviews'=>$Museums_Reviews_true);
				break;
			case 'columnist':
				$param = array('news'=>$Auctions_News_true); //not in use
				break;
			case 'features':
				$param = array('news'=>$Auctions_News_true); // not in use
				break;	
			
		}

	/** for visual arts catgory */

	if(!empty($categ_genu_res)){
		
		$channelUrl = $path."visual-arts/".text2linktext($categ_sub_subs).'/'.text2linktext($categ_genu_res).".php".$param[$categ_genu_res];
		echo '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_genu_res.'</a></h6>';
	}
	elseif(!empty($categ_sub_subs)){
		
		$channelUrl = $path."visual-arts/".text2linktext($categ_sub_channel).'/'.text2linktext($categ_sub_subs).".php".$param[$categ_sub_subs];
		echo '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_sub_subs.'</a></h6>';
	}
	elseif(!empty($categ_sub_channel)){
		$channelUrl = $path."visual-arts/".text2linktext($categ_sub_channel).'/'.text2linktext($categ_sub_channel).".php?".$categ_sub_channel."_flag=true";
		echo '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_sub_channel.'</a></h6>';
	}

		

	/** for Architecture & design  */
		
		if(!empty($categ_ArchitectureChannels))
		{	
			switch ($categ_ArchitectureChannels) {
				
				case 'architecture':
					$channelUrl = $path.'architecture-design/'.$categ_ArchitectureChannels.'.php'.$Arc_Architecture_true;
					break;
				case 'design':
					$channelUrl = $path.'architecture-design/'.$categ_ArchitectureChannels.'.php'.$Arc_Design_true;
					break;
				case 'home & interiors':
					$categ_Arc = str_replace(' ','-',$categ_ArchitectureChannels);
					$channelUrl = $path.'architecture-design/'.$categ_Arc.'.php'.$Arc_Home_Interiors_true;
					break;
				default:
					$channelUrl = $path.'architecture-design/'.$categ_Arc.'.php'.$Arc_Home_Interiors_true;		
					break;
				
			}
			echo '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_ArchitectureChannels.'</a></h6>';
		}elseif(!empty($categ_ArchitectureSubs))
		{
			return $categ_ArchitectureSubs;

		}
			
	/** for Performing Arts  */
			
		if(!empty($categ_PerformanceChannels))
		{
			switch ($categ_PerformanceChannels) {
				case 'film':
					$channelUrl = $path.'performing-arts/'.$categ_PerformanceChannels.'.php'.$Per_Film_true;
					break;
				case 'music':
					$channelUrl = $path.'performing-arts/'.$categ_PerformanceChannels.'.php'.$Per_Music_true;
					break;
				case 'television':
					$channelUrl = $path.'performing-arts/'.$categ_PerformanceChannels.'.php'.$Per_Television_true;
					break;
				case 'opera':
					$categ_Per = str_replace(' ','-',$categ_PerformanceChannels);
					$channelUrl = $path.'performing-arts/calendar/'.$categ_Per.'.php'.$Opera_per_true;
					break;
				case 'Theatre & Dance':
					$categ_Per = str_replace(' ','-',$categ_PerformanceChannels);
					$channelUrl = $path.'performing-arts/calendar/'.$categ_Per.'.php'.$Theater_Dance_per_true;
					break;		
				
				default:
					$channelUrl = $path.'performing-arts/'.$categ_Per.'.php'.$Per_Theatre_Dance_true;
					break;
				
			}
			echo '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_PerformanceChannels.'</a></h6>';	
			
		}elseif(!empty($categ_PerformanceSubs))
		{
			echo  $categ_PerformanceSubs;

		}

	/** for Lifestyles  */
			
		if(!empty($categ_LifesytlesChannels))
		{
			$url_categ_LifesytlesChannels = text2linktext($categ_LifesytlesChannels);
			
			switch ($categ_LifesytlesChannels) {
				case 'food & wine':
					$channelUrl = $path.'lifestyle/'.$url_categ_LifesytlesChannels.'.php'.$Lifestyle_Food_Wine_true;
					break;
				case 'jewelry & watches':
					$channelUrl = $path.'lifestyle/'.$url_categ_LifesytlesChannels.'.php'.$Lifestyle_Jewelry_Watches_true;
					break;
				case 'autos & boats':
					$channelUrl = $path.'lifestyle/'.$url_categ_LifesytlesChannels.'.php'.$Lifestyle_Autos_Boats_true;
					break;
				case 'auctions':
					$channelUrl = $path.'lifestyle/'.$url_categ_LifesytlesChannels.'.php'.$Lifestyle_Auctions_true;
					break;	
				default:
					$channelUrl = $path.'lifestyle/'.$url_categ_LifesytlesChannels.'.php'.$Lifestyle_Food_Wine_true;
					break;
			}
			echo '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_LifesytlesChannels.'</a></h6>';
		}elseif(!empty($categ_LifesytlesSubs))
		{
			return $categ_LifesytlesSubs;

		}

	/** for Fashion  */
		
		if(!empty($categ_FashionChannels))
		{
			$channelUrl = $path.'fashion/'.$categ_FashionChannels.'.php'.'?'.$categ_FashionChannels.'_flag=true';
			echo '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_FashionChannels.'</a></h6>';
		}elseif(!empty($categ_FashionSubs))
		{
			return $categ_FashionSubs;

		}

	/** for Travel+culture  */
				
		if(!empty($categ_TravelChannels))
		{	
			//echo $categ_TravelChannels;

			switch ($categ_TravelChannels) {
				case 'people':
					$channelUrl = $path.'culture-travel/'.$categ_TravelChannels.'.php'.$Travel_People_true;
					break;
				case 'inspiration':
					$channelUrl = $path.'culture-travel/'.$categ_TravelChannels.'.php'.$Travel_Inspiration_true;
					break;
				case 'destination':
					$channelUrl = $path.'culture-travel/'.$categ_TravelChannels.'.php'.$Travel_Destinations_article_true;
					break;		
				
				default:
					$channelUrl = $path.'culture-travel/'.$categ_TravelChannels.'.php'.$categ_TravelChannels.'_flag=true';
					
					break;
			}

			
		}
		echo '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_TravelChannels.'</a></h6>';


	}

/** End of gettopCategrory()  */

/** To get Art Market News Category **/


		function getAuthorArticle($dataArray)
		{
			$datas = $dataArray->author;
			$profileName = $datas[0]->profile;

			$firstName  = $profileName->firstName;
			$lastName  = $profileName->lastName;
			$fullName = $firstName.' '.$lastName;
			return $fullName;
		}
		function getTotalValues($dataArray)
		{
			$datas = $dataArray->total;
			$totalValue = $datas->value;

			return $totalValue;
		}

		function getAuthorArticle2($dataArray)
		{
			$datas = $dataArray->author_article;
			$profileName = $datas[0]->profile;

			$firstName  = $profileName->firstName;
			$lastName  = $profileName->lastName;
			$fullName = $firstName.' '.$lastName;
			return $fullName;
		}

		function getAuthorID($dataArray){
			$author_article = $dataArray->author_article;
			return $author_article[0]->_id;
		}
		function getAllAuthors($dataArray)
		{
			$author_article = $dataArray->author_article;
			foreach ($author_article as $key => $value) {
				$profile = $value->profile;
				$fullName[] = $profile->firstName.' '.$profile->lastName;
			}
			//return $authors_name;
			$authors_name = implode(', ', $fullName);
			return $authors_name;
		}
		function getAuthorEvents($dataArrays)
		{
			$datass = $dataArrays->field_entity_profile_location;
			$fullName = $datass[0]->entityName;
			return $fullName;
		}

		// get images 
		/** not using orignal name of image in code , using key **/

		function getfileslocation($dataArray,$sliderImg)
		{
			$datas = $dataArray->files;
			
			if($sliderImg == 'sliderImg'):

				foreach ($datas[0]->sliderImg as $key => $value)
				{
					$location[] = $value->location;
				}	
				return $location;	
			elseif($sliderImg == 'uploadFiles'):
					$uploadFiles = $datas[0]->uploadFiles;
					$uploadFiles_location = $uploadFiles[0]->location;
					return	$uploadFiles_location;
			elseif($sliderImg == 'main_events_photos'):
					$main_events_photos = $datas[0]->main_events_photos;
					$main_events_photos_location = $main_events_photos[0]->location;
					return	$main_events_photos_location;	
			endif;	
		}

		function getfilesOrignalName($dataArray,$sliderImg)
		{
			$datas = $dataArray->files;
			
			if($sliderImg == 'sliderImg'):

				foreach ($datas[0]->sliderImg as $key => $value)
				{
					$location[] = $value->location;
				}	
				return $location;	
			elseif($sliderImg == 'uploadFiles'):
					$uploadFiles = $datas[0]->uploadFiles;
					$uploadFiles_originalname = $uploadFiles[0]->key;
					return	$uploadFiles_originalname;
		 	elseif($sliderImg == 'main_events_photos'):
					$main_events_photos = $datas[0]->main_events_photos;
					$main_events_photos_originalname = $main_events_photos[0]->key;
					return	$main_events_photos_originalname;	


			endif;	
		}

		function getAltText($dataArray)
		{
			$alt_text = $dataArray->alt_text;
			return $alt_text;
		}

		/** Article Funcitons **/

		function getArticleById($contentType,$dataType,$contentId)
		{
		 	
			global $mediaserver,$webapiserver;

			$mediaServer= "{$mediaserver}resource/downloadfile";
		 	$api_article_Data = "{$webapiserver}{$contentType}/{$dataType}/{$contentId}";
		    $api_article_Contents = file_get_contents($api_article_Data);
		    $apiDataArrays = json_decode($api_article_Contents);
		    return $apiDataArrays;
		}

		function getFileNameUrl($url){
				$final_path_name = basename($url["path"], ".");
				$urls = explode("\\",$final_path_name);
				return end($urls);
		}

		function getArticleBody($dataArray,$flag)
		{
			
			//paragraph image
			$files = $dataArray->files;
			$paragraph_img = $files[0]->paragraph_img;
			
			$para_data = $dataArray->para_data;
			foreach($para_data as $para_key=>$item_para):

				$para_url = parse_url($item_para->para_img);
				if($paragraph_img[$para_key]->originalname == getFileNameUrl($para_url)){
					getMainImage($paragraph_img[$para_key],'main');
				}
			echo "<div class='article_para_cover'><h3>".$item_para->para_head."</h3>";
			echo $item_para->para_body;

			// if(!empty($paragraph_img[$para_key])){$para_image_array = $paragraph_img[$para_key];
			// 		getMainImage($para_image_array,'main');
			// 	}
			echo "<p>".$item_para->para_img_cap_credit."</p></div>";
			endforeach;
			
			//$para_body = $para_data[0]->para_body;

			//limit for paragraph
			// if(!$flag):
			// 	$strLen = strlen($para_body);
			// 	$para_limit_count = floor($strLen/2);
			// 	$para_body = substr($para_body, 0, $para_limit_count);

			// endif;
			//return $para_body;	
		}

		/** Article Funcitons **/

		/** SlideShow Funciton **/

		function getSlideShowData($contentType,$dataType)
		{
			global $mediaserver,$webapiserver;

			$mediaServer= "{$mediaserver}resource/downloadfile";
	      	$slideshowApi = "{$webapiserver}$contentType/$dataType";
	      	$slideshowConent = file_get_contents($slideshowApi);
	      	$slideshowConents = json_decode($slideshowConent);
	      	$slideshowArrays = $slideshowConents->result;

	      	return $slideshowArrays;
		}

		/** Slideshows by Parameter Or Category | parameter is the category */

		function getSlideShowsByParam($contentType,$dataType,$param)
		{
			global $mediaserver,$webapiserver;

			$mediaServer= "{$mediaserver}resource/downloadfile";
	      	$slideshowApi = "{$webapiserver}$contentType/$dataType{$param}";
	      	$slideshowConent = file_get_contents($slideshowApi);
	      	$slideshowConents = json_decode($slideshowConent);
	      	$slideshowArrays = $slideshowConents->result;
			//asort($slideshowArrays);	
	      	return $slideshowArrays;
		}

		/** Slideshows by Id | parameter is the category */

		function getSlideShowsById($contentType,$dataType,$slider_Id)
		{
			global $mediaserver,$webapiserver;

			$mediaServer= "{$mediaserver}resource/downloadfile";
	      	$slideshowApi = "{$webapiserver}$contentType/$dataType{$slider_Id}";
	      	$slideshowConent = file_get_contents($slideshowApi);
	      	$slideshowConents = json_decode($slideshowConent);
	      	$slideshowArrays = $slideshowConents->result;
			asort($slideshowArrays);	
	      	return $slideshowArrays;
		}

		function getUnderMenu($pageNames,$pageParams,$currentPage)
		{
				$currentPath = getcwd();
			?>	<nav class="navbar navbar-default">
				<ul class="nav navbar-nav">
	 		<?php	$page_param_count=0;
	      		foreach($pageNames as $page_key => $page_name): ?>
			    	<li class="<?php if($page_key == strtolower($current_page)){ echo 'active';}?>">
			        <a href="<?php echo $currentPath . $page_name.$pageParams[$page_param_count]; ?>"><?php echo $page_key; ?></a>
			    </li>
	  		<?php 
	  			$page_param_count++;
	    		endforeach; 
	  		?>
				</ul>      
				</nav>
			<?php
		}

/** Entity Related Functions **/
	function getEntityType($dataArray)
	{
		$entityType = $dataArray->entityType;
		return $entityType;
	}
	function getEntityName($dataArray)
	{
		$entityname = $dataArray->entityName;	
		return $entityname;
	}

	function getBriefInfo($dataArray)
	{
		$briefInfo = $dataArray->briefInfo;
		return $briefInfo;
	}

	function getEventsOriginalname($dataArray)
	{
		$files = $dataArray->files;
		$location_photos = $files[0]->location_photos;
		$originalname = $location_photos[0]->originalname;
		return $originalname;
	}

	function getEventsLocation($dataArray)
	{
		$files = $dataArray->files;
		$location_photos = $files[0]->location_photos;
		$location = $location_photos[0]->location;
		return $location;
	}


/** Entity Related Functions **/

/** Seo releated function **/
function getSeoDataKeywords($dataArray)
{

	$seo_keywords = $dataArray->seo_keywords;
	return $seo_keywords;

}
function getSeoDataTitle($dataArray)
{

	$seo_title = $dataArray->seo_title;
	return $seo_title;

}
/** Seo releated function **/

/** Homepage Api **/
	function getHomePageData($contentType,$dataType,$countryCode)
	{
		global $mediaserver;
		global $webapiserver;	    
		
		$mediaServer= "{$mediaserver}resource/downloadfile";
		$apiData = "{$webapiserver}{$contentType}/{$dataType}?countryCode={$countryCode}";
		$apiDataContents = file_get_contents($apiData);
		$ApidataContentdecoded = json_decode($apiDataContents);
		$apiDataArrays = $ApidataContentdecoded->result;      
		return $apiDataArrays[0];
	}	


	function getSectionData($dataArray,$section_key)
	{
		$hp_section_data = $dataArray->$section_key;
		array_multisort($hp_section_data);
		return $hp_section_data;	
		
	}
	function getViews($dataArray)
	{
		$views_count = $dataArray->views;
		return $views_count;
	}
	function getHomePageImageData($hpDataArray)
	{
		$image = $hpDataArray->image;
		$image_root = $image[0];
		$uploadFiles = $image_root->uploadFiles;
		return $uploadFiles[0];	
	}
/** Homepage Api **/


/** Get channel Page Data **/
	function getChannelPageData($contentType,$dataType,$countryCode,$channelKey)
	{
		$all_channelData = getApiData($contentType,$dataType,$countryCode);
		$channelArray = $all_channelData[0]->$channelKey;

		return $channelArray;
	}
/** Get channel Page Data **/


/** get Tags **/
	
	function getTags($articleArray)
	{
		$tagArray = $articleArray->tags;
		foreach ($tagArray as $tag_key => $tag_item) {
			$tagName[$tag_item->_id] = $tag_item->tagName;
		}
		return $tagName;
	}

	
/** get Tags **/


/** get Artist Data **/

function getMPartists($artists,$allartistdata)
{
		global $mediaserver;
		global $webapiserver;	
		//http://localhost:7005/api/v1/website/artist/allartistdata
		
		$apiData = "{$webapiserver}{$artists}/{$allartistdata}";
		$apiDataContents = file_get_contents($apiData);
		$ApidataContentdecoded = json_decode($apiDataContents);
		return $ApidataContentdecoded->results;
}

function getArrayPrinted($dataArray,$arrayKeys)
{
	if(is_array($dataArray)):
		foreach ($dataArray as $key => $arrayItem) {
			$array_value[] = $arrayItem->$arrayKeys;
		}
	endif;
	$array_printed = implode(', ',$array_value);
	return $array_printed;
}

/** to get hichart **/

function getHichart($year,$totalSale,$totalArtworks)
{ 
	$data_year = min($year);
	$data_totalSale = implode(',',$totalSale);
	$data_totalArtworks = implode(',',$totalArtworks);
?>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/series-label.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<div class="col-lg-12">
	<div class="col-lg-6" id="container1"></div>
	<div class="col-lg-6" id="container2"></div>
</div>
<script type="text/javascript">
	console.log([<?php echo $data_totalArtworks;?>]);
	Highcharts.chart('container1', {

    title: {
        text: 'Total Sales Vales (USD)'
    },

    subtitle: {
        text: 'Source: blouinartinfo.com'
    },

    yAxis: {
        title: {
            text: 'Total Value Sales(USD)'
        }
    },
    legend: {
        layout: 'horizontal',
        align: 'left'
        
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: <?php echo $data_year;?>
        }
    },

    series: [{
        name: 'Andy warhol',
        data: [2022, 3033, 4044, 4555, 5566, 6077, 3588, 5099,6077, 3588, 5099,4444]
    }, {
        name: 'Pablo Picasso',
        data: [<?php echo $data_totalArtworks;?>]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});
	Highcharts.chart('container2', {

    title: {
        text: 'Volume of sales'
    },

    subtitle: {
        text: 'Source: blouinartinfo.com'
    },

    yAxis: {
        title: {
            text: 'Volume of sales'
        }
    },
    legend: {
        layout: 'horizontal',
        align: 'left'
        
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: <?php echo $data_year;?>
        }
    },

    series: [{
        name: '<?php echo "Andy warhol"; ?>',
        data: [20, 30, 40, 45, 55, 60, 35, 50]
    }, {
        name: '<?php echo "Pablo Picasso"; ?>',
        data: [24, 40, 74, 51, 49, 82, 81, 74]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});
</script>
<?php	
	
}/** end getHichart() **/


/** 
	getHichartArray()
	$apikeys contains following
	array('artistid'=>'187246','minYear'=>'2007','maxYear'=>'2018'); 

	https://interactivetooldemo.blouinartsalesindex.com/api/priceindex/187246?minYear=2007&maxYear=2018&c=&u=&filterBy=YEAR');

*/

function getHichartArray($apikeys)
{
	$ArtistId = $apikeys['ArtistId'];
	$minYear = $apikeys['minYear'];
	$maxYear = $apikeys['maxYear'];

	$itd_baseUrl= "https://interactivetooldemo.blouinartsalesindex.com/api/priceindex/";
	$apiData = "{$itd_baseUrl}{$ArtistId}?minYear={$minYear}&maxYear={$maxYear}&c=&u=&filterBy=YEAR";
	$apiDataContents = file_get_contents($apiData);
	$ApidataContentdecoded = json_decode($apiDataContents);
	foreach ($ApidataContentdecoded->data as $key => $salesindexvalue) 
			{
				$year[] = $salesindexvalue->year;
				$totalSale[] = $salesindexvalue->totalSale;
				$totalArtworks[] = $salesindexvalue->totalArtworks;
			}
	getHichart($year,$totalSale,$totalArtworks);			
}


/** Get Artist Details **/
	function getArtistById($contentType,$dataType,$artistID)
	{
		global $mediaserver,$webapiserver;

			$mediaServer= "{$mediaserver}resource/downloadfile";
	      	$artistDetailApi = "{$webapiserver}$contentType/$dataType/{$artistID}";
	      	$artistDetailConent = file_get_contents($artistDetailApi);
	      	$artistDetailConents = json_decode($artistDetailConent);
	      	
			
	    return $artistDetailConents;
	}


	function getAuthorImage($dataArray,$imageArray)
	{
		$files = $dataArray->files;
		$author_photos = $files[0]->author_photos;
		return $author_photos[0]->$imageArray;
	}

	function getArtistImage($dataArray)
	{
		$files = $dataArray->files;
		if(!empty($files)):
		$author_photos = $files[0]->author_photos;
		$imageArray = $author_photos[0];
		getMainImage($imageArray,'thumbnail');
		else:
			getDefaultimage('thumbnail');
		endif;
	}
/** Get Artist Details **/

/** Get Default image 
	if main image is missing this image will be displayed 
**/
	function getDefaultimage($imageType)
	{
		global $path;
		switch ($imageType) {
			case 'main':
				echo $image = "<img class='img-responsive center-block' src='".$path."images/main-icon.png'/>";
				break;
			case 'thumbnail':
				echo $image = "<img class='img-responsive center-block' src='".$path."images/thumbnail-icon.jpg'/>";
				break;
			
		}

	}
/** Get Default image **/

/** GetImages for Article Grid 
	$defaultImageType is for thumbnail or main image if image is missing
**/
	function getMainImage($ImageArray,$defaultImageType){
		
		global $mediaserver;
		$src = $mediaserver."resource/downloadfile?filename=";
		$filename = $ImageArray->key;
		$filePath = $ImageArray->location;
		$alt = $ImageArray->title;
		$final_src = $src.$filename."&".$filePath;
		//print_r($ImageArray->key);
		if(!empty($ImageArray->location)):
			echo "<img class='img-responsive center-block' src='".$final_src."' alt='".$alt."' />";
		else:
			echo getDefaultimage($defaultImageType);
		endif;	
    }

    // Commonly using in Article details page Recommende sections

    function getUpdloadedFiles($dataArrays,$defaultImageType){
    	global $mediaserver;
		$src = $mediaserver."resource/downloadfile?filename=";
    	$files = $dataArrays->files;
    	$uploadFiles = $files[0]->uploadFiles;
    	// below case is used in search/artwork.php
    	if(empty($uploadFiles)){$uploadFiles = $files[0]->artwork_photos;}
    	$filename  = $uploadFiles[0]->key;
    	$filePath  = $uploadFiles[0]->location;
		$alt 	   = $dataArray->title;
		$final_src = $src.$filename."&".$filePath;
		if(!empty($uploadFiles)):
			echo "<img class='img-responsive center-block' src='".$final_src."' alt='".$alt."' />";
		else:
			echo getDefaultimage($defaultImageType);
		endif;
    }



    // Commonly using in Article details page Recommende sections

    function getmainEventsPhotos($dataArray,$defaultImageType){
    	global $mediaserver;
		$src = $mediaserver."resource/downloadfile?filename=";

    	$files = $dataArray->files;
    	$uploadFiles = $files[0]->main_events_photos;

    	$filename  = $uploadFiles[0]->key;
    	$filePath  = $uploadFiles[0]->location;
		$alt 	   = $dataArray->title;
		$final_src = $src.$filename."&".$filePath;

		if(!empty($uploadFiles)):
			echo "<img  class ='list grid' src='".$final_src."' alt='".$alt."' />";
		else:
			echo getDefaultimage($defaultImageType);
		endif;
    }


    // Commonly using in Article details page Most Popular sections

    function getMostPopularImages($dataArray,$defaultImageType){
    	global $mediaServer;
		$src = $mediaServer."?filename=";
		
    	$files = $dataArray->image;
    	$uploadFiles = $files[0]->uploadFiles;
    	$filename  = $uploadFiles[0]->key;
    	$filePath  = $uploadFiles[0]->location;
		$alt 	   = $dataArray->title;
		$final_src = $src.$filename."&".$filePath;

		if(!empty($files[0])):
			echo "<img src='".$final_src."' alt='".$alt."' />";
		else:
			echo getDefaultimage($defaultImageType);
		endif;
    }

/** GetImages for Article Grid **/
/** get Tags Data **/

function getTagsData($contentType,$dataType,$tagName)
		{
		 	global $mediaserver;
		    global $webapiserver;	    
		  	
		  	$mediaServer= "{$mediaserver}resource/downloadfile";
		    $tagData = "{$webapiserver}{$contentType}/{$dataType}?tagsName={$tagName}";
		    $tagDataContents = file_get_contents($tagData);
		    $tagDataContentsdecoded = json_decode($tagDataContents);
		   	$apiDataArrays = $tagDataContentsdecoded->result;
		   	$TagNameArticles = $apiDataArrays->docs;
		  	if(!empty($TagNameArticles)){
		  		return $TagNameArticles;		
		  	}
		  	else
		  	{
		  		echo "No data";
		  	}
		   
		    
		}
/** get Tags Data **/

/** get blouinartsalesindex Artist Data **/
function getSalesArtistData()
{
	$baseAPI = "https://www.blouinartsalesindex.com/component/searchByNamePast?";
	
	 $fetch_keys = array('first_name'=>'Paul','last_name'=>'Fischer','YearBirth'=>'1860','YearDeath'=>'1934','includeImages'=>'true','datafor'=>'past');
	foreach ($fetch_keys as $key => $data_key) {
			$link_end .= $key."=".$data_key."&";
	}
	
	 $url = $baseAPI.$link_end;
	//print_r($final_url);
	 
	 $artistDataContents = simplexml_load_file($url);
	 return $artistDataContents;
}
/** get blouinartsalesindex Artist Data **/		

/** Search Functions  **/
function getSearchResults($contentType,$pageNum)
{
	//print_r($webapiserver);
	global $webapiserver;
	$content = $contentType;
	$contentMethod = "get".$contentType;
	if($pageNum){
	  $url = $webapiserver.$content."/".$contentMethod."?page=".$pageNum;
	}else{
		$url = $webapiserver.$content."/".$contentMethod;
	}

	$searchedContents = file_get_contents($url);
//	var_dump($webapiserver);
	$decodedSearched = json_decode($searchedContents);
	
	switch ($contentType) {
		case 'artist':
			$searchResultsArray = $decodedSearched;
			break;
		
		default:
			$searchResultsArray = $decodedSearched->result;
			break;
	}
	if(!empty($searchResultsArray)){
		return  $searchResultsArray;
	}
	
		   	
}


function getSearchAll($contentType){
	$content = 'article';
	$contentMethod = "get"."searchall";
	$url = "http://localhost:7005/api/v1/website/".$content."/".$contentMethod;
	$searchedContents = file_get_contents($url);
	$decodedSearched = json_decode($searchedContents);
	//echo "<pre>";print_r($decodedSearched);
	switch ($contentType) {
		case 'Article':
			$searchResultsArray = $decodedSearched->Article;
			
			break;
		case 'Artists':
			$searchResultsArray = $decodedSearched->Artists;
			
			break;
		case 'venues':
			$searchResultsArray = $decodedSearched->venues;
			
			break;
		case 'event':
			$searchResultsArray = $decodedSearched->event;
			
			break;
		case 'slideshow':
			$searchResultsArray = $decodedSearched->slideshow;
			
			break;				
		case 'artwork':
			$searchResultsArray = $decodedSearched->artwork;
			
			break;		
		default:
			$searchResultsArray = $decodedSearched->result;
			break;
	}
	if(!empty($searchResultsArray)){
		return  $searchResultsArray;
	}
}
/** to get details page url by its name , need to pass just detail page name **/

function getDetailPagelink($pageType)
{
	global $path;
	switch ($pageType) {
		case 'article':
			$detailsPageLink = $path."news.php?id=";
			break;
		case 'events':
			$detailsPageLink = $path."events/events-details.php?id=";
			break;
		case 'artist':
			$detailsPageLink = $path."artists/artist-overview.php?id=";
			break;
		case 'venues':
			$detailsPageLink = $path."venues/overview.php?id=";
			break;
		case 'slideshow':
			$detailsPageLink = $path."visual-arts/photo-gallery/gallery.php?id=";
			break;
		case 'artworks':
			$detailsPageLink = $path."artworks/artworks-overview.php?id=";
			break;
		default:
			# code...
			break;
	}
	return $detailsPageLink;
}
/** Search Functions  **/

/** get Venues location_photos **/
function getVenuesLocationPhotos($dataArray,$defaultImageType)
{
	$files 	= $dataArray->files;
	$location_photos = $files[0]->location_photos;
	//echo "<pre>";print_r($location_photos);
	echo getMainImage($location_photos[0],$defaultImageType);

}
/** get Venues location_photos **/

/** Pagination **/
function getPagination($paginationArray){


  
  $perPage = $paginationArray['perPage'];  // max. number of items to display per page
  $currentpage = $paginationArray['currentpage'];  // max. number of items to display per page
  $this_page = $path.$currentPage;
  $itemCount = $paginationArray['itemCount'];      // need to pass here main array 

if(!isset($_GET['page']) || !$page = intval($_GET['page'])) {
    $page = 1;
  }

  // extra variables to append to navigation links (optional)
  $linkextra = [];
  if(isset($_GET['var1']) && $var1 = $_GET['var1']) { // repeat as needed for each extra variable
    $linkextra[] = "var1=" . urlencode($var1);
  }
  $linkextra = implode("&amp;", $linkextra);
  if($linkextra) {
    $linkextra .= "&amp;";
  }

  // build array containing links to all pages
  $tmp = [];
  for($p=1, $i=0; $i < $itemCount; $p++, $i += $perPage) {
    if($page == $p) {
      // current page shown as bold, no link
      $tmp[] = "<li class='page-item active'><a>{$p}</a></li>";
    } else {
      $tmp[] = "<a href=\"{$this_page}?{$linkextra}page={$p}\">{$p}</a>";
    }
  }

  // thin out the links (optional)
  for($i = count($tmp) - 3; $i > 1; $i--) {
    if(abs($page - $i - 1) > 2) {
      unset($tmp[$i]);
    }
  }

  // display page navigation iff data covers more than one page
  if(count($tmp) > 1) {
    echo "<nav class='pager_cover' aria-label='...''><ul class='pagination'>";

    if($page > 1) {
      // display 'Prev' link
      echo "<li class='page-item'><a href=\"{$this_page}?{$linkextra}page=" . ($page - 1) . "\">&laquo; Prev</a></li>";
    } else {
      // echo "Page ";
    }

    $lastlink = 0;
    foreach($tmp as $i => $link) {
      if($i > $lastlink + 1) {
        echo "<li class='page-item dots_3'><a href='#'> ... </a></li>"; // where one or more links have been omitted
      } elseif($i) {
        //echo " | ";
      }
      echo "<li class='page-item'>".$link."</li>";
      $lastlink = $i;
    }

    if($page <= $lastlink) {
      // display 'Next' link
      echo "<li class='page-item'><a href=\"{$this_page}?{$linkextra}page=" . ($page + 1) . "\">Next &raquo;</a></li>";
    }

    echo "</ul></nav>";
  }
	
}
/** Pagination **/

/** get Pagination Array **/
	function getPaginationArray($dataArray){
		$itemCount = $dataArray->itemCount;
        $perPage = $dataArray->perPage;
        $currentpage = getCurrentPage().".php";
        
		$paginationArray = array("perPage"=>$perPage,"currentpage"=>$currentpage,"itemCount"=>$itemCount);

        return $paginationArray;
	}
/** get Pagination Array **/



function text2linktext($name){
	$lowerText   = strtolower($name);
	$text2linktext = str_replace(" ", "-", $lowerText);
	return $text2linktext;
}

function link2text($name){
	$lowerText   = strtolower($name);
	$text2linktext = str_replace("-", " ", $lowerText);
	return $text2linktext;
}

function getCategoryParam($sub_cat_label){
	
	global 	$Arc_Architecture_true,
			$Arc_Design_true,
			$Arc_Home_Interiors_true,
			$Per_Film_true,
			$Per_Music_true,
			$Per_Theatre_Dance_true,
			$Per_Television_true,
			$Lifestyle_Jewelry_Watches_true,
			$Lifestyle_Food_Wine_true,
			$Lifestyle_Autos_Boats_true,
			$Lifestyle_Auctions_true,
			$Fashion_Exhibitions_true,
			$Fashion_Designer_Spotlight_true,
			$Fashion_Runway_true,
			$Fashion_Style_Guide_true,
			$Fashion_Accessories_true,
			$Travel_Inspiration_true;
	
	//echo $sub_cat_label;		
	switch ($sub_cat_label) {
		case 'architecture':
			$param = $Arc_Architecture_true;
			break;
		case 'design':
			$param = $Arc_Design_true;
			break;
		case 'home-&-interiors':
			$param = $Arc_Home_Interiors_true;
			break;			
		case 'film':
			$param = $Per_Film_true;
			break;
		case 'music':
			$param = $Per_Music_true;
			break;
		case 'threater-dance':
			$param = $Per_Theatre_Dance_true;
			break;
		case 'television':
			$param = $Per_Television_true;
			break;
		case 'jewelry-&-watches':
			$param = $Lifestyle_Jewelry_Watches_true;
			break;
		case 'food-&-wine':
			$param = $Lifestyle_Food_Wine_true;
			break;
		case 'autos-&-boats':
			$param = $Lifestyle_Autos_Boats_true;
			break;
		case 'auctions':
			$param = $Lifestyle_Auctions_true;
			break;
		case 'exhibitions':
			$param = $Fashion_Exhibitions_true;
			break;
		case 'runway':
			$param = $Fashion_Runway_true;
			break;
		case 'style-guide':
			$param = $Fashion_Style_Guide_true;
			break;
		case 'accessories':
			$param = $Fashion_Accessories_true;
			break;
		case 'inspiration':
			$param = $Travel_Inspiration_true;
			break;
		case 'people':
			$param = $Travel_Inspiration_true;
			break;
		case 'inspiration':
			$param = $Travel_Inspiration_true;
			break;
		

		
		default:
			# code...
			break;
	}
	return $param;
}


/** sub channel Link gettopCategrory **/
function getChannelLink($itemArray){
	global $path;
	$category_type_article = text2linktext($itemArray->category_type_article);
	$sub_cat_label = text2linktext($itemArray->sub_cat_label);
	$itemArray->sub_cat_label;
	switch ($category_type_article) {
		
		case 'visual-arts':
			if(!empty($sub_cat_label)){
				
				switch ($sub_cat_label) {
					case 'columnist':
							$channelUrl = $path.$category_type_article.'/'.$category_type_article.'.php';
							$catNametoShow = $itemArray->category_type_article;
					break;
					
					default:
						$channelUrl = $path.$category_type_article.'/'.$sub_cat_label.'/'.$sub_cat_label.'.php'.'?'.$sub_cat_label.'_flag=true';
						$catNametoShow = $itemArray->sub_cat_label;
					break;
				}
				
			}else{
				$channelUrl = $path.$category_type_article.'/'.$category_type_article.'.php';
			$catNametoShow = $itemArray->category_type_article;
			}
			
			break;
		
		case 'architecture-design':
			$param = getCategoryParam($sub_cat_label);
			$category_type_article = "architecture-&-design";
			$channelUrl = $path.$category_type_article.'/'.$sub_cat_label.'.php'.$param;
			$catNametoShow = $itemArray->sub_cat_label;
			break;
		
		case 'performance-&-arts':
			$category_type_article = "performing-arts";
			$param = getCategoryParam($sub_cat_label);
			$channelUrl = $path.$category_type_article.'/'.$sub_cat_label.'.php'.$param;
			$catNametoShow = $itemArray->sub_cat_label;
			break;
		
		case 'lifestyle':
			
			if(!empty($sub_cat_label)){
				$param = getCategoryParam($sub_cat_label);
				$channelUrl = $path.$category_type_article.'/'.$sub_cat_label.'.php'.$param;
				$catNametoShow = $itemArray->category_type_article;
			}else{
				$channelUrl = $path.$category_type_article.'/'.$category_type_article.'.php';
				$catNametoShow = $itemArray->category_type_article;
			}
			break;

		case 'travel':
			$category_type_article = "culture-travel";
			if(!empty($sub_cat_label)){
				$param = getCategoryParam($sub_cat_label);
				$channelUrl = $path.$category_type_article.'/'.$sub_cat_label.'.php'.$param;
				$catNametoShow = $sub_cat_label;
			}else{
				$channelUrl = $path.$category_type_article.'/'.$category_type_article.'.php';
				$catNametoShow = $itemArray->category_type_article;
			}
			break;

		case 'fashion':
			//$category_type_article = "culture-travel";
			if(!empty($sub_cat_label)){
				$param = getCategoryParam($sub_cat_label);
				$channelUrl = $path.'lifestyle/'.$category_type_article.'/'.$sub_cat_label.'.php'.$param;
				$catNametoShow = $itemArray->category_type_article;
			}else{
				$channelUrl = $path.'lifestyle/'.$category_type_article.'/'.$category_type_article.'.php';
				$catNametoShow = $itemArray->category_type_article;
			}
			break;	
		
		default:
			$param = getCategoryParam($sub_cat_label);
			$channelUrl = $path.$category_type_article.'/'.$sub_cat_label.'.php'.$param;
			$catNametoShow = $itemArray->category_type_article;
			break;	

	}
	echo $channelAnchorTag = '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$catNametoShow.'</a></h6>';
	

	// if(!empty($category_type_article) && !empty($sub_cat_label)){
	// 	$channelUrl = $path.$category_type_article.'/'.$sub_cat_label.'/'.$sub_cat_label.'.php'.'?'.$sub_cat_label.'_flag=true';
	// 	echo $channelAnchorTag = '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$itemArray->sub_cat_label.'</a></h6>';
	// }
	
	
	
}
/** sub channel Link **/
/** Entity Profile Location **/ 

function getEntityProfileLoation($itemArray){
	global $path;
	$locArray = $itemArray->field_entity_profile_location;
	$enitity_array_location = $locArray[0]->enitity_array_location;
	$file_url = $path."assets/country/country.json";
	$str = file_get_contents($file_url);
	$country_datas = json_decode($str);
	//echo "<pre>";print_r($enitity_array_location);
	//$locArray = array('country'=>'100','stateProvince'=>'37','city'=>'242');

	foreach ($country_datas as $key => $value) {
		
		$country = $value[$enitity_array_location[0]->country]; 
		$stateProvince_code = $enitity_array_location[0]->stateProvince;
		$city_code = $enitity_array_location[0]->city;

		$CountryName = $country->CountryName;
		$all_states = $country->States;
		$stateName = $all_states[$stateProvince_code]->StateName;
		$Cities = $all_states[$stateProvince_code]->Cities;
		$cityName = $Cities[$city_code];
	    

	    if(!empty($cityName) || !empty($stateName) || !empty($CountryName) ):
	    	$final_location = $cityName.' '.$stateName.','.$CountryName;
	    endif;
	    return $final_location;
		
	}
}

function getCountryBycode($code){
	global $path;
	$file_url = $path."assets/country/country.json";
	$str = file_get_contents($file_url);
	$country_datas = json_decode($str);	
	//echo "<pre>";print_r($country_datas);	

	foreach ($country_datas as $key => $value) {
		
		$country = $value[$code]; 
		$CountryName = $country->CountryName;
		if(!empty($CountryName)):
	    	$final_location = $CountryName;
	    endif;
	}
	return $final_location;
}


function getFullAddress($defaultLocation){
	global $path;
	
	$file_url = $path."assets/country/country.json";
	$str = file_get_contents($file_url);
	$country_datas = json_decode($str);
	//echo "<pre>";print_r($country_datas);	

	foreach ($country_datas as $key => $value) {
		$country = $value[$defaultLocation->country]; 
		$CountryName = $country->CountryName;
		$stateProvince_code = $defaultLocation->stateProvince;
		$city_code = $defaultLocation->city;
		$all_states = $country->States;
		$stateName = $all_states[$stateProvince_code]->StateName;
		$Cities = $all_states[$stateProvince_code]->Cities;
		$cityName = $Cities[$city_code];
		
	}
	if(!empty($cityName) || !empty($stateName) || !empty($CountryName) ):
	    	$final_location = $cityName.' '.$stateName.','.$CountryName;
	endif;
	return $final_location;
}

// duplication function category page using
function getEntityProfileLoation2($itemArray){
	global $path;
	$locArray = $itemArray->field_entity_profile_location;
	$enitity_array_location = $locArray[0]->enitity_array_location;
	$file_url = $path."assets/country/country.json";
	$str = file_get_contents($file_url);
	$country_datas = json_decode($str);
	//echo "<pre>";print_r($locArray);
	//$locArray = array('country'=>'100','stateProvince'=>'37','city'=>'242');

	foreach ($country_datas as $key => $value) {
		
		$country = $value[$enitity_array_location[0]->country]; 
		$country_code = $enitity_array_location[0]->country;
		$stateProvince_code = $enitity_array_location[0]->stateProvince;
		$city_code = $enitity_array_location[0]->city;
		
		$CountryName = $country->CountryName;
		$all_states = $country->States;
	//	$stateName = $all_states[$stateProvince_code]->StateName;
		$Cities = $all_states[$stateProvince_code]->Cities;
		$cityName = $Cities[$city_code];
	    

	    if(!empty($cityName)  || !empty($CountryName) ):
	    	$final_location = $cityName. ', '.$CountryName;
	    endif;
	    return $final_location;
		
	}
}

// duplication function category page using
function getEntityProfileLoation3($itemArray){
	global $path;
	$enitity_array_location = $itemArray->enitity_array_location;
	$file_url = $path."assets/country/country.json";
	$str = file_get_contents($file_url);
	$country_datas = json_decode($str);
	//echo "<pre>";print_r($locArray);
	//$locArray = array('country'=>'100','stateProvince'=>'37','city'=>'242');

	foreach ($country_datas as $key => $value) {
		
		$country = $value[$enitity_array_location[0]->country]; 
		$country_code = $enitity_array_location[0]->country;
		$stateProvince_code = $enitity_array_location[0]->stateProvince;
		$city_code = $enitity_array_location[0]->city;
		
		$CountryName = $country->CountryName;
		$all_states = $country->States;
	//	$stateName = $all_states[$stateProvince_code]->StateName;
		$Cities = $all_states[$stateProvince_code]->Cities;
		$cityName = $Cities[$city_code];
	    

	    if(!empty($cityName)  || !empty($CountryName) ):
	    	$final_location = $cityName. ', '.$CountryName;
	    endif;
	    return $final_location;
		
	}
}

function getEntityProfileLocationName($itemArray){
		$field_entity_profile_location = $itemArray->field_entity_profile_location;
		$locationName = $field_entity_profile_location[0]->entityName;
		return $locationName;
}			


/** Events api **/
function getEventCategory($dataArray){
	global $path;

	global $VA_Calendar_Art_Fairs_true,$VA_Calendar_Gallery_Shows_true,$VA_Calendar_Museum_Exhibitions_true,$VA_Calendar_Auctions_true,$VA_Calendar_Talks_true,$Film_per_true,$Music_per_true,$Opera_per_true,$Theater_Dance_per_true,$Auctions_life_true,$Auto_Boats_life_true,$Fashion_life_true,$Food_Wine_life_true,$Jewelry_Watches_life_true;

	$param = array(
				"art fairs"=>$VA_Calendar_Art_Fairs_true,
				"gallery shows"=>$VA_Calendar_Gallery_Shows_true,
				"museum exhibitions"=>$VA_Calendar_Museum_Exhibitions_true,
				"auctions"=>$VA_Calendar_Auctions_true,
				"talks"=>$VA_Calendar_Talks_true,
				"film"=>$Film_per_true,
				"music"=>$Music_per_true,
				"opera"=>$Opera_per_true,
				"theater & dance"=>$Theater_Dance_per_true,
				"life"=>$Auctions_life_true,
				"auto & boats"=>$Auto_Boats_life_true,
				"fashion"=>$Fashion_life_true,
				"food & wine"=>$Food_Wine_life_true,
				"jewelry & watches"=>$Jewelry_Watches_life_true
	);
		

	$category_type_article = text2linktext($dataArray->category_type_article);
		
	//getting all category sub-cat sub-sub-categories names 
	$categ_genu_res = strtolower(getEnabledValue($dataArray->genu_res));
	$categ_sub_subs = strtolower(getEnabledValue($dataArray->sub_subs));			
	$categ_sub_channel = strtolower(getEnabledValue($dataArray->sub_channel));
	$categ_ArchitectureSubs = strtolower(getEnabledValue($dataArray->ArchitectureSubs));
	$categ_ArchitectureChannels = strtolower(getEnabledValue($dataArray->ArchitectureChannels));
	$categ_PerformanceChannels = strtolower(getEnabledValue($dataArray->PerformanceChannels));
	$categ_PerformanceSubs = strtolower(getEnabledValue($dataArray->PerformanceSubs));
	$categ_LifesytlesChannels = strtolower(getEnabledValue($dataArray->LifesytlesChannels));
	$categ_LifesytlesSubs = strtolower(getEnabledValue($dataArray->LifesytlesSubs));
	$categ_FashionChannels = strtolower(getEnabledValue($dataArray->FashionChannels));
	$categ_FashionSubs = strtolower(getEnabledValue($dataArray->FashionSubs));			
	$categ_TravelChannels = strtolower(getEnabledValue($dataArray->TravelChannels));
	$categ_TravelSubs = strtolower(getEnabledValue($dataArray->TravelSubs));
	//getting all category sub-cat sub-sub-categories names
	
	switch ($category_type_article) {
		
		case 'visual-arts':
				$channelUrl = $path.$category_type_article.'/calendar/'.text2linktext($categ_sub_channel).'.php'.$param[$categ_sub_channel];
				echo $channelAnchorTag = '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_sub_channel.'</a></h6>';
			break;

		case 'performance-&-arts':
				$channelUrl = $path.'performing-arts/calendar/'.text2linktext($categ_PerformanceChannels).'.php'.$param[$categ_PerformanceChannels];
				echo $channelAnchorTag = '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_PerformanceChannels.'</a></h6>';
			break;

		case 'lifestyle':
				$channelUrl = $path.$category_type_article.'/calendar/'.text2linktext($categ_LifesytlesChannels).'.php'.$param[$categ_LifesytlesChannels];
				echo $channelAnchorTag = '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_LifesytlesChannels.'</a></h6>';
			break;

		case 'culture-travel':
				$channelUrl = $path.$category_type_article.'/calendar/'.text2linktext($categ_TravelChannels).'.php'.$param[$categ_TravelChannels];
				echo $channelAnchorTag = '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$categ_TravelChannels.'</a></h6>';
			break;	

		case 'architecture-design':
				$channelUrl = $path.'architecture-&-design/calendar.php';
				echo $channelAnchorTag = '<h6><a class="category_type_article" href="'.$channelUrl.'">'.$dataArray->category_type_article.'</a></h6>';
			break;			
		
		default:
			echo "--";
			break;
	}
	
}	
/** Events api **/

/** Only channel for category list pages **/
function getMainChannel($dataArray){
	
	global $path;
	$category_type_article = text2linktext($dataArray->category_type_article);

	switch ($category_type_article) {
		case 'architecture-design':
			$category_type_article = "architecture-&-design";
			$channelLink = $path.text2linktext($category_type_article).'/'.text2linktext($category_type_article).'.php';
		break;
		case 'performance-&-arts':
			$category_type_article = "performing arts";
			$channelLink = $path.text2linktext($category_type_article).'/'.text2linktext($category_type_article).'.php';
			break;
		case 'travel':
			$category_type_article = "culture travel";
			$channelLink = $path.text2linktext($category_type_article).'/'.text2linktext($category_type_article).'.php';
			$category_type_article = 'culture + travel';
			break;	
		default:
			$channelLink = $path.text2linktext($category_type_article).'/'.text2linktext($category_type_article).'.php';
			break;	
		
	}

	
	echo '<a class="category_type_article" href='.$channelLink.'>'.$dataArray->category_type_article.'</a>';
}
/** Only channel for category list pages **/

/** get Slideshow category with link **/

function getSliderChannellink($dataArray){
	global $path;
	global $VA_Slideshows_Reviews_true,$VA_Slideshows_Arts_Fair_true,$VA_Slideshows_Auctions_true,$VA_Slideshows_Galleries_true,$VA_Slideshows_Museums_true,$VA_Slideshows_Columnists_true,$VA_Slideshows_Features_true,$VA_Slideshows_Show_Around_The_World_true,$Architecture_architectural_true,$Design_architectural_true,$home_interior_slideshow,$Arc_venues_true,$Arc_calendar_true,$Arc_slideshows_true,$Film_performanceChannel_true,$Music_performanceChannel_true,$Television_performanceChannel_true,$Theatre_Dance_performanceChannel_true,$Lifestyle_Jewelry_Watches_true,$Auctions_lifesttylechannel_true,$Autos_Boats_lifesttylechannel_true,$Fashion_Runway_true,$Food_Wine_lifesttylechannel_true,$Jewelry_Watches_lifesttylechannel_true,$travel_slideshow_people,$inspiration_travel_slideshow,$travel_slideshow_destinations;

	

	$category_type_article = text2linktext($dataArray->category_type_article);

	//getting all category sub-cat sub-sub-categories names 
	$categ_genu_res = strtolower(getEnabledValue($dataArray->genu_res));
	$categ_sub_subs = strtolower(getEnabledValue($dataArray->sub_subs));			
	$categ_sub_channel = strtolower(getEnabledValue($dataArray->sub_channel));
	$categ_ArchitectureSubs = strtolower(getEnabledValue($dataArray->ArchitectureSubs));
	$categ_ArchitectureChannels = strtolower(getEnabledValue($dataArray->ArchitectureChannels));
	$categ_PerformanceChannels = strtolower(getEnabledValue($dataArray->PerformanceChannels));
	$categ_PerformanceSubs = strtolower(getEnabledValue($dataArray->PerformanceSubs));
	$categ_LifesytlesChannels = strtolower(getEnabledValue($dataArray->LifesytlesChannels));
	$categ_LifesytlesSubs = strtolower(getEnabledValue($dataArray->LifesytlesSubs));
	$categ_FashionChannels = strtolower(getEnabledValue($dataArray->FashionChannels));
	$categ_FashionSubs = strtolower(getEnabledValue($dataArray->FashionSubs));			
	$categ_TravelChannels = strtolower(getEnabledValue($dataArray->TravelChannels));
	$categ_TravelSubs = strtolower(getEnabledValue($dataArray->TravelSubs));
	//getting all category sub-cat sub-sub-categories names

	$parameter_Array = array(
		'reviews'=>$VA_Slideshows_Reviews_true,
		'fairs'=>$VA_Slideshows_Arts_Fair_true,
		'auctions'=>$VA_Slideshows_Auctions_true,
		'galleries'=>$VA_Slideshows_Galleries_true,
		'museums'=>$VA_Slideshows_Museums_true,
		'columnist'=>$VA_Slideshows_Columnists_true,
		'features'=>$VA_Slideshows_Features_true,
		'reviews'=>$VA_Slideshows_Show_Around_The_World_true,

		'architecture'=>$Architecture_architectural_true,
		'design'=>$Design_architectural_true,
		'home & interiors'=>$home_interior_slideshow,
		'reviews'=>$Arc_venues_true,
		'reviews'=>$Arc_calendar_true,
		'reviews'=>$Arc_slideshows_true,

		'film'=>$Film_performanceChannel_true,
		'music'=>$Music_performanceChannel_true,
		'television'=>$Television_performanceChannel_true,
		'theatre & dance'=>$Theatre_Dance_performanceChannel_true

	);
	// conflict in keys ,adding new array parameter
	
	$param = array(
		'auctions'=>$Auctions_lifesttylechannel_true,
		'autos boats'=>$Autos_Boats_lifesttylechannel_true,
		'fashion'=>$Fashion_Runway_true,
		'food & wine'=>$Food_Wine_lifesttylechannel_true,
		'jewelry & watches'=>$Jewelry_Watches_lifesttylechannel_true,
		'people'=>$travel_slideshow_people,
		'inspiration'=>$inspiration_travel_slideshow,
		'destinations'=>$travel_slideshow_destinations
	); 


	 
	 //http://localhost:9999/newbai/WebsiteClinet/visual-arts/slideshows/galleries.php?galleries_slideshow_flag=true
	 //print_r($parameter_Array);
	switch ($category_type_article) {
	 	case 'visual-arts':
	 		$channelLink = $path.text2linktext($category_type_article).'/slideshows/'.text2linktext($categ_sub_channel).'.php'.$parameter_Array[$categ_sub_channel];
	 		
	 		echo '<a class="category_type_article" href='.$channelLink.'>'.$categ_sub_channel.'</a>';
	 		break;

	 	case 'architecture-design':
	 		$category_type_article = "architecture-&-design";
	 		$channelLink = $path.text2linktext($category_type_article).'/slideshows/'.text2linktext($categ_ArchitectureChannels).'.php'.$parameter_Array[$categ_ArchitectureChannels];
	 		
	 		echo '<a class="category_type_article" href='.$channelLink.'>'.$categ_ArchitectureChannels.'</a>';
	 		break;

	 	case 'performance-&-arts':
	 		$channelLink = $path.'performing-arts/slideshows/'.text2linktext($categ_PerformanceChannels).'.php'.$parameter_Array[$categ_PerformanceChannels];

	 		echo '<a class="category_type_article" href='.$channelLink.'>'.$categ_PerformanceChannels.'</a>';
	 		break;

	 	case 'lifestyle':
	 		$channelLink = $path.text2linktext($category_type_article).'/slideshows/'.text2linktext($categ_LifesytlesChannels).'.php'.$param[$categ_LifesytlesChannels];

	 		echo '<a class="category_type_article" href='.$channelLink.'>'.$categ_LifesytlesChannels.'</a>';
			break;		
	 		
	 	case 'travel':
	 		$channelLink = $path.'culture-travel/slideshows/'.text2linktext($categ_TravelChannels).'.php'.$param[$categ_TravelChannels];

	 		echo '<a class="category_type_article" href='.$channelLink.'>'.$categ_TravelChannels.'</a>';
			break;	
	 	default:
	 		# code...
	 		break;
	 } 

	 
	 
}
/** get Slideshow category with link **/

/** ip locaiton funciton **/
function getCountryCode($ip = NULL, $purpose = "location", $deep_detect = TRUE) {
    $output = NULL;
    if (filter_var($ip, FILTER_VALIDATE_IP) === FALSE) {
        $ip = $_SERVER["REMOTE_ADDR"];
        if ($deep_detect) {
            if (filter_var(@$_SERVER['HTTP_X_FORWARDED_FOR'], FILTER_VALIDATE_IP))
                $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
            if (filter_var(@$_SERVER['HTTP_CLIENT_IP'], FILTER_VALIDATE_IP))
                $ip = $_SERVER['HTTP_CLIENT_IP'];
        }
    }
    $purpose    = str_replace(array("name", "\n", "\t", " ", "-", "_"), NULL, strtolower(trim($purpose)));
    $support    = array("country", "countrycode", "state", "region", "city", "location", "address");
    $continents = array(
        "AF" => "Africa",
        "AN" => "Antarctica",
        "AS" => "Asia",
        "EU" => "Europe",
        "OC" => "Australia (Oceania)",
        "NA" => "North America",
        "SA" => "South America"
    );
    if (filter_var($ip, FILTER_VALIDATE_IP) && in_array($purpose, $support)) {
        $ipdat = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=" . $ip));
        if (@strlen(trim($ipdat->geoplugin_countryCode)) == 2) {
            switch ($purpose) {
                case "location":
                    $output = array(
                        "city"           => @$ipdat->geoplugin_city,
                        "state"          => @$ipdat->geoplugin_regionName,
                        "country"        => @$ipdat->geoplugin_countryName,
                        "country_code"   => @$ipdat->geoplugin_countryCode,
                        "continent"      => @$continents[strtoupper($ipdat->geoplugin_continentCode)],
                        "continent_code" => @$ipdat->geoplugin_continentCode
                    );
                    break;
                case "address":
                    $address = array($ipdat->geoplugin_countryName);
                    if (@strlen($ipdat->geoplugin_regionName) >= 1)
                        $address[] = $ipdat->geoplugin_regionName;
                    if (@strlen($ipdat->geoplugin_city) >= 1)
                        $address[] = $ipdat->geoplugin_city;
                    $output = implode(", ", array_reverse($address));
                    break;
                case "city":
                    $output = @$ipdat->geoplugin_city;
                    break;
                case "state":
                    $output = @$ipdat->geoplugin_regionName;
                    break;
                case "region":
                    $output = @$ipdat->geoplugin_regionName;
                    break;
                case "country":
                    $output = @$ipdat->geoplugin_countryName;
                    break;
                case "countrycode":
                    $output = @$ipdat->geoplugin_countryCode;
                    break;
            }
        }
    }
    return $output['country_code'];
}
/** ip locaiton funciton **/


/** get lat long **/
function getLatLong($enitity_array_location){
		$latitude = $enitity_array_location->latitude;
		$longitude = $enitity_array_location->longitude;

		$latLong = $latitude.','.$longitude;
		return $latLong;
}
/** get lat long **/

/* get search All page */
function getSearhAllData($dataType,$param){

	global $mediaserver;
	global $searchServer;	    
		  	
		  	$mediaServer= "{$mediaserver}resource/downloadfile";
		    $apiData = "{$searchServer}{$dataType}{$param}";
		    $apiDataContents = file_get_contents($apiData);
		    $ApiContentdecoded = json_decode($apiDataContents);
	return $ApiContentdecoded;

}


function getHitResult($dataArray){
	$hits = $dataArray->hits;
	//echo "<pre>"; print_r($hits);
	return $hits;
}

function getTotalValue($totalData){
	//print_r($hitsData);
	$total = $totalData->total;
   	$value = $total->value;
	return $value;
}	



// pass $thitInhit from loop in hits
function getSearchtitle($loopData,$dataType){

		$highlight = $loopData->highlight;

	switch ($dataType) {
		case 'title':
			$title = $highlight->title;
			$title = $title[0];
			break;
		case 'short_title':
			$title = $highlight->short_title;
			$title = $title[0];
			break;
		case 'shortTitle':
			$title = $highlight->shortTitle;
			$title = $title[0];
		case 'artistName':
			$title = $highlight->artistName;
			$title = $title[0];
			break;
		case 'entityName':
			$title = $highlight->entityName;
			$title = $title[0];
			break;	
		
		default:
			# code...
			break;
	}

	return $title;
}

// nationalisty
function getnationalityElastic($dataType){

		$source = $dataType->_source;
		$nationality = $source->nationality;
		$place_of_birth = $source->place_of_birth;
		$place_of_death = $source->place_of_death;

		return $nationality.', '.$place_of_birth.' - '.$place_of_death;
}
// field artists
function getfieldartistElastic($dataType){

		$source = $dataType->_source;
		$fieldartist = $source->field_artists[0];
		$artistName = $fieldartist->artistName;

		return $artistName;
}



