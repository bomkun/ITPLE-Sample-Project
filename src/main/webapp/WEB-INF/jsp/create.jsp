<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>ITPLE Sample Project REST Example</title>
	
	<script type="text/javascript" src="${contextPath}/resources/js/lib/jquery-1.8.0.js"></script>
	<script type="text/javascript" src="${contextPath}/resources/js/lib/jquery-ui-1.11.1/jquery-ui.js"></script>
	
	
	<script type="text/javascript" src="${contextPath}/resources/dist/js/bootstrap.min.js"></script>
	<link href="${contextPath}/resources/dist/css/bootstrap.css" rel="stylesheet" media="screen">
	
</head>
<body>
		<div id="title_info" align="center">
			<b>Being Java | Registration Form</b>
			<span class="glyphicon glyphicon-home"></span>
		</div>
		
	<div id="contents_info" align="center">
		<form name="form" id="form" method="post" onsubmit="return false;">
		<br>
		<table id="table_info">
			<tr>
				<th>Name :</th>
				<td>
				<input type="text" class="form-control" name="name" id="name" value="">
				</td>
			</tr>
			<tr>
				<th>Gender :</th>
				<td>		
  					<input type="radio"  name="gender" value="male">Male
  					<input type="radio"  name="gender" value="female">Female
				</td>
			</tr>
			<tr>
				<th>Email :</th>
				<td>
				<input type="text" id="email" name ="email" class="form-control" value="">
				</td>
			</tr>			
			<tr>
				<th>Phone :</th>
				<td>
				<input type="text" id="phone" name="phone" class="form-control" maxlength="11" value="">
				</td>
			</tr>			
			<tr>
				<th>City :</th>
				<td>
					<select class="form-control" name="city" id='city'>				
					<option value="0">--select--</option>
					<option value="1">Delhi</option>
					<option value="2">Guragon</option>
					<option value="3">aderkgaon</option>
					<option value="4">Others</option>
					</select>
				</td>
			</tr>
		</table>
		</form>
	<br><br>
	<button type="button" class="btn btn-info" id="submit_btn">save</button>
	<button type="button" class="btn btn-danger" id="reset_btn">reset</button>	
	</div>		
</body>

<script type="text/javascript">
	
$(document).ready(function(){
	
	$("#submit_btn").click(function() {
		
		var name = $("#name").val();
		var gender = $('input:radio[name=gender]:checked').val();
		var email = $("#email").val();
		var phone = $("#phone").val();
		var city = $("#city").val();
		var num_regExp = /^[0-9]*$/;  	
		
        if(!$.trim($("#name").val()).length) {
            alert("name을 입력하여 주십시오");
            $("#name").focus();
            return false;
        }
		
		if($('input:radio[name=gender]:checked').length <1 ) {
			alert("gender를 선택 하세요");
			$("#radio1").focus();
			return false;	
		}
        
        if(!$.trim($("#email").val()).length) {
        	alert("email을 입력하여 주십시오");
        	$("#email").focus();
        	return false;
        }
        
        if(!$.trim($("#phone").val()).length) {
        	alert("phone을 입력하여 주십시오");
        	$("#phone").focus();
        	return false;
        }
		
        if(!num_regExp.test(phone) ) {
        	alert("phone은 숫자만 입력해 주세요");
        	$("#phone").val("");
        	$("#phone").focus();
        	return false;
        }
        
        
        if($("#city option").index($("#city option:selected")) == 0) {
			alert("city를 선택해 주십시오");
			$("#city").focus();
			return false;
		}
        
        console.log(name);
        console.log(gender);
        console.log(email);
        console.log(phone);
        console.log(city);

        
        $.ajax({
        	type: "post",
        	url : "http://localhost:8080/ITPLE-Sample-Project/info",
        	data : $("#form").serialize(),
        	dataType : "json",
        	 success: function(xhr){
        		 //성공시
        		 alert("success");
        		  },
        		  error: function(){      
        		//실패시
        		 alert("failed");
        		  }
        });
	});
	
});	

</script>
</html>