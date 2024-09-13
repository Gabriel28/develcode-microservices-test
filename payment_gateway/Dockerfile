FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY .mvn .mvn
COPY mvnw pom.xml ./

# Da permisões de execução ao arquivo, já que em casos isolados sem essa instrução ele pode não responder. _Permission Denied_ 
RUN chmod +x ./mvnw 

RUN ./mvnw dependency:go-offline

COPY src ./src

CMD ["./mvnw", "spring-boot:run"]
