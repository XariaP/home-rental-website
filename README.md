## Home Rental Website (Front-end and Back-end)
Run the following files in the root folder to activate the project.  
```
./startup.sh  
./run.sh  
```

### Notes
If the error following error occurs,
```/bin/bash^M: bad interpreter: No such file or directory```
run the following commands and try again.

```
sed -i -e 's/\r$//' startup.sh   
sed -i -e 's/\r$//' run.sh
```
