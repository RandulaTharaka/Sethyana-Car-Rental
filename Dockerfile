# Start with a base image that includes the Java runtime
FROM openjdk:11-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file from your local machine into the container
# The `*` matches the specific JAR file name
COPY build/libs/*.jar app.jar

# Expose the port the Spring Boot app will use
EXPOSE 8080

# The command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]