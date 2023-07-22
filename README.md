## Home Rental Website (Front-end and Back-end)
Run the following files in the root folder to activate the project.  
./startup.sh  
./run.sh  

If the error "/bin/bash^M: bad interpreter: No such file or directory" occurs,
run the following commands.
sed -i -e 's/\r$//' startup.sh
sed -i -e 's/\r$//' run.sh