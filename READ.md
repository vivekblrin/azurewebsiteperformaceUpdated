swagger api : - https://fakerestapi.azurewebsites.net/
============================================================================
Install Java 1.8.0_331
Intall apache-maven-3.8.6
install Jmeter 3.0
install Git and Git bash
JAVA_HOME= D:\Java\jdk1.8.0_331
adding following to PATH SYSTEM variable
PATH=D:\apache-maven-3.8.6\bin;C:\Program Files\Git\cmd;C:\Program Files\Git\bin

install Jmeter 3.0 
example  Jmeter_Home = D:\apache-jmeter-3.0
and create add Jmeter plugin jars for stepping Thread Group
from Jmeter plugin home page by

downloading jpgc-casutg-2.0.zip and extract all the below jars

jmeter-plugins-casutg-2.0.jar
jmeter-plugins-cmn-jmeter-0.4.jar
jmeter-plugins-manager-0.20.jar 

and add to Jmeter_Home/lib/ext directory

start Jmeter 3.0 and create Test Plan add Thread group- Stepping Thread and create 
5 stepping Thread with different payload for each  https request as mentioned as per requirement 

5 .jmx files generated copy any one of them like
below 
httpRequest_GetAuthors.jmx
httpRequest_postAuthors.jmx
httpRequest_GetAuthorsByBookId .jmx
httpRequest_GetAuthorsById.jmx
httpRequest_PutAuthorsById
httpRequest_deleteAuthorsById.jmx

and copy to 
to D:\mindtickleIntvWS\azurewebsiteperformaceUpdated\src\test\jmeter folder

============================================================================
Generate Report via command line

run command "mvn clean verify"
then 
run command "mvn pre-site"

will generate report in
D:\mindtickleIntvWS\azurewebsiteperformaceUpdated\target\jmeter\results\dashboard\index.html
============================================================================ 
Generate Report via scripts
alternatively we can run
 
azurewebsiteperformaceUpdated_build.bat or azurewebsiteperformaceUpdated_build.sh
will generate report in following folder
D:\mindtickleIntvWS\azurewebsiteperformaceUpdated\target\jmeter\results\dashboard\index.html
