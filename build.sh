#!/bin/bash

function bbq_deploy {
	cd $1
	mvn source:jar deploy -DaltDeploymentRepository=snapshot-repo::default::file:../../bbq-maven-repo/releases 
	cd ../
}

function bbq_install {
	cd $1/trunk
	mvn clean install
	mvn source:jar
	cp target/*-sources.jar ~/.m2/repository/org/bbqjs/$1/$2
	cd ../../
}

COMMAND=$1
MODULE=$2

if [ $COMMAND ] && [ $MODULE ]
then
	if [ $COMMAND = "deploy" ]
	then
		bbq_deploy $MODULE
		exit
	elif [ $COMMAND = "install" ]
	then
		bbq_install $MODULE
		exit
	else
		echo Command should be "deploy" or "install"
		exit
	fi
fi

if [ -z $COMMAND ]
then
	echo
	echo USAGE: build.sh COMMAND [MODULE]
	echo
	echo eg. To install locally run ./build.sh install
	echo eg. To add to bbq-mave-repo run ./build.sh deploy
	echo
	exit
fi

if [ $COMMAND = "deploy" ]
then
	bbq_deploy "bbq"
	bbq_deploy "bbq-javascript-compiler"
	bbq_deploy "bbq-test"
	bbq_deploy "bbq-spring-integration"
	bbq_deploy "bbq-maven-plugin"
	#bbq_deploy "bbq-maven-archetype"
fi

if [ $COMMAND = "install" ]
then
	bbq_install "bbq"
	bbq_install "bbq-javascript-compiler"
	bbq_install "bbq-test"
	bbq_install "bbq-spring-integration"
	bbq_install "bbq-maven-plugin"
	#bbq_install "bbq-maven-archetype" $VERSION
fi