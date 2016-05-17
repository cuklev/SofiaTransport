#!/bin/bash

# comment

{
	echo "module.exports = ["

	base_url="https://schedules.sofiatraffic.bg/"
	while read rel_path; do
		case $rel_path in
			tramway*) linetype=0 ;;
			autobus*) linetype=1 ;;
			trolley*) linetype=2 ;;
		esac
		linename=${rel_path#*/}

		echo Downloading $rel_path >&2

		m_url="http://m.sofiatraffic.bg/schedules?tt=$linetype&ln=$linename&s=%D0%A2%D1%8A%D1%80%D1%81%D0%B5%D0%BD%D0%B5"

		first=1
		while read line; do
			route_regex='info">([^<]*)<'
			stop_regex='^\s*(.*)\s\(([0-9]*)\)\s*</option'

			if [[ $line =~ $route_regex ]]; then
				routename=${BASH_REMATCH[1]}
				[[ $first == 0 ]] && echo "	]},"
				first=0
				echo "	{linename: '$linename', linetype: $linetype, routename: '$routename', stops: ["
			elif [[ $line =~ $stop_regex ]]; then
				stopname=${BASH_REMATCH[1]}
				stopcode=$(echo ${BASH_REMATCH[2]} | sed 's/^0*//')
				echo "		{stopcode: $stopcode, stopname: '$stopname'},"
			fi
		done < <(curl -s "$m_url")
		echo "	]},"
	done < <(curl -s "$base_url"| grep -Eo 'href="(tramway|autobus|trolley)[^"]*' | sed 's/href="//')

	echo "];"
} > raw_database.js
