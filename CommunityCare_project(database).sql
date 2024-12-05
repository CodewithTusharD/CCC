create database CommunityCare;
use CommunityCare;

create table accounts(email varchar(30) primary key, password varchar(30) , MemType varchar(25),dos date, Ustatus int);
select * from accounts;
drop table accounts;
select * from accounts where MemType='Donar';

create table prof_donar(email varchar(30) primary key,name varchar(30),Contact varchar(12),Address varchar(60),City varchar(30),ID varchar(30),ID_proof varchar(75),Availhrs varchar(100));
select * from prof_donar;
drop table prof_donar;

create table Med_details(serial_no int auto_increment primary key ,email varchar(30),Med_name varchar(40),Exp_date date,Packaging varchar(35),Quantity int);
drop table Med_details;
select * from Med_details;

create table prof_needy(email varchar(40) primary key,name varchar(30),Contact varchar(12),Address varchar(100),City varchar(20),ID_proof varchar(100),DOB date,Gender varchar(20));
drop table prof_needy;
select * from prof_needy;