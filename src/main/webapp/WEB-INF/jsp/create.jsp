<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>ITPLE Sample Project REST Example</title>
	
	<script type="text/javascript" src="${contextPath}/resources/js/lib/jquery-1.9.1.js"></script>
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
			<input type="hidden" name="email">
			<input type="hidden" name="phone">
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
  					<input type="radio"  id ="gender1" name="gender" value="male">Male
  					<input type="radio"  id ="gender2" name="gender" value="female">Female
				</td>
			</tr>
			<tr>
				<th>Email :</th>
				<td >
				<input type="text" id="email01" name="email01">@<input type="text" id="email02" name ="email02"  value="">
				<select name="selEmail02" id="selEmail02" >
							<option value="self">직접입력</option>
							<option value="naver.com" >naver.com</option>
							<option value="chol.com" >chol.com</option>
							<option value="dreamwiz.com" >dreamwiz.com</option>
							<option value="empal.com" >empal.com</option>
							<option value="freechal.com" >freechal.com</option>
							<option value="gmail.com" >gmail.com</option>
							<option value="hanafos.com" >hanafos.com</option>
							<option value="hanmail.net" >hanmail.net</option>
							<option value="hanmir.com" >hanmir.com</option>
							<option value="hitel.net" >hitel.net</option>
							<option value="hotmail.com" >hotmail.com</option>
							<option value="korea.com" >korea.com</option>
							<option value="lycos.co.kr" >lycos.co.kr</option>
							<option value="nate.com" >nate.com</option>
							<option value="netian.com" >netian.com</option>
							<option value="paran.com" >paran.com</option>
							<option value="yahoo.com" >yahoo.com</option>
							<option value="yahoo.co.kr" >yahoo.co.kr</option>
						</select>
				</td>
			</tr>			
			<tr>
				<th>Phone :</th>
				<td>
				<select name="phone01" id="phone01">
					<option value="0">--select--</option>
					<option value="010">010</option>
					<option value="011">011</option>
					<option value="016">016</option>
					<option value="017">017</option>
					<option value="019">019</option>
				</select>
				- <input type="text" id="phone02" name="phone02" style=width:40px maxlength="4"> - <input type="text" id="phone03" name="phone03" style=width:40px maxlength="4">
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
			<tr>
			<th>response</th>
			<td>response1 <input type="radio" id="res1" name="res" value="res1"/>  response2 <input type="radio" id="res2" name="res" value="res2" />
		</table>
		</form>
	<br><br>
	<button type="button" class="btn btn-info" id="submit_btn">save</button>
	<button type="button" class="btn btn-danger" id="reset_btn">reset</button>	
	</div>		
</body>

<script type="text/javascript">
	
$(document).ready(function(){
	


	
	$("#selEmail02").change(function() {
		var value = $( this ).val();
		if (value == "self") {
			$("#email02").val("");
			$("#email02").css("display","");
			$("#email02").focus();
		} else {
			$("#email02").val(value);
			$("#email02").css("display","none");
		}
	});
	
	$("#reset_btn").click(function() {
		$("#form").each(function() {
			this.reset();
		});
	});
	
	$("#submit_btn").click(function() {
		var name = $("#name").val();
		var gender = $('input:radio[name=gender]:checked').val();
		var email =$("#email01").val() + "@" + $("#email02").val();
		var phone = $("#phone01").val() + "-" + $("#phone02").val() + "-" + $("#phone03").val();
		var city = $("#city").val();
		var num_regExp = /^[0-9]{3,4}$/;  	
		var email_regExp = /[A-Za-z0-9-]{2,}\.[A-Za-z0-9]{2,}/i;
		var url ="";
		var param ="";
		var contentType ="";
		
		$("input[name$='email']").val(email);
		$("input[name$='phone']").val(phone);
		
        if(!$.trim($("#name").val()).length) {
            alert("name을 입력하여 주십시오");
            $("#name").focus();
            return false;
        }
		
		if($('input:radio[name=gender]:checked').length <1 ) {
			alert("gender를 선택 하세요");
			$("#gender1").focus();
			return false;	
		}
        
		if($("#selEmail02 option").index("#selEmail02 option:selected") == 0 && !$.trim($("#email02").val()).length ) {
			alert("email을 선택해 주십시오");
			$("#selEmail02").focus();
			return false;
		}
		
        if(!$.trim($("#email01").val()).length) {
        	alert("email을 입력하여 주십시오");
        	$("#email01").focus();
        	return false;
        }
        
        if(!email_regExp.test($("input[name$='email02']").val())) {
        	alert("email 형식이잘못되었습니다 ex) aaa.naver.com")
        	$("#email02").focus();
        	return false;
        }
        
        
        if($("#phone01 option").index($("#phone01 option:selected")) == 0) {
        	alert("phone을 선택해 주십시오");
        	$("#phone01").focus();
        	return false;
        }
        
        if(!$.trim($("input[name$='phone02']").val()).length || !$.trim($("input[name$='phone03']").val()).length) {
        	alert("phone을 입력하여 주십시오");

        	if(!$.trim($("input[name$='phone02']").val()).length) {
        		$("#phone02").focus();	
        	} else {
        		$("#phone03").focus();
        	}
 
        	return false;

        }
        
        if(!num_regExp.test($("input[name$='phone02']").val())) {
          	alert("phone을 다시 입력해주세요");
          	$("#phone02").val("");
          	$("#phone02").focus();
          	return false;
          }
        
        if(!num_regExp.test($("input[name$='phone03']").val())) {
        	alert("phone을 다시 입력해주세요");
        	$("#phone03").val("");
        	$("#phone03").focus();
        	return false;
        }
        
        if($("#city option").index($("#city option:selected")) == 0) {
			$("#city").focus();
			alert("city를 선택해주세요");
			return false;
		}
        
        
    	if( $("input:radio[id='res1']").is(":checked")) {
    		url = "http://localhost:8080/ITPLE-Sample-Project/create";
    		param = $("#form").serialize();
    		contentType = "application/x-www-form-urlencoded; charset=UTF-8";
    	}

    	if( $("input:radio[id='res2']").is(":checked")) {
    		console.log("res2 checked");
    		url = "http://localhost:8080/ITPLE-Sample-Project/create2";
    		param = "<user><name> "+ name + "</name>"
    				+ "<gender>" + gender + "</gender>"
    				+ "<email>" + email + "</email>"
    				+ "<phone>" + phone + "</phone>"
    				+ "</city>" + city + "</city>"
    				+ "</user>";
    		contentType = "application/xml;charset=utf-8";
    	}
    	
        $.ajax({
        	type: "post",
        	url : url,
        	dataType: "xml",
        	data : param,
        	contentType : contentType
        	})
        	 .done(function(xhr){
       		 	//성공시
       		 	alert("success");
       		 	alert(param);
       	 	})
       		 .fail(function(xhr){      
       			//실패시
       		 	alert("failed");
       		 	alert(param);
       		});
        
        return false;
	});
	
});	

</script>
</html>