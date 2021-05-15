create database mtl_store;

use mtl_store;

create table customer(
id int unsigned not null auto_increment,
email varchar(100) not null,
password varchar(1024) not null,
first_name varchar(100) null,
last_name varchar(100) null,
phone_number varchar(20) null,
created_date timestamp not null default current_timestamp,
primary key (id)
)

create table product(
id int unsigned not null auto_increment,
category enum('Men','Womem','Kids'),
name varchar(100) not null,
description text not null,
price varchar(20) not null,
quantity int unsigned not null,
brand varchar(100) not null,
size varchar(20) not null,
created_date timestamp not null default current_timestamp,
is_active tinyint(1) default 1,
primary key (id)
)