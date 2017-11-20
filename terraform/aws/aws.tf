provider "aws" {
  access_key = "ACCESS_KEY_HERE"
  secret_key = "SECRET_KEY_HERE"
  region     = "eu-west-2"
}

resource "aws_instance" "example_00" {
  ami           = "ami-002b3e64"
  instance_type = "t2.micro"
}

resource "aws_instance" "example_01" {
  ami           = "ami-dba8bebf"
  instance_type = "t2.micro"
}

