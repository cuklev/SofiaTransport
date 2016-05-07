#!/bin/bash

# Obtain database.js from the sqlite databases of the android app using this script
# Use this script to extract the data from the android app to a javascript array

{
	echo "module.exports = ["

	sqlite3 com.sofiatraffic.android/databases/stops.db "select line_type,line_name,line_routes_id,line_route_name from lines;" | while read line; do
		line_type=${line%%|*}
		line=${line#*|}
		line_name=${line%%|*}
		line=${line#*|}
		route_id=${line%%|*}
		route_name=${line##*|}

		echo "	{linename: '$line_name', linetype: $line_type, routename: '$route_name', points: ["

		sqlite3 com.sofiatraffic.android/databases/stops.db "select stop_point_lat,stop_point_lon,stop_code,stop_name from stop_points where stop_point_parent_id=$route_id" | while read point; do
			lat=${point%%|*}
			point=${point#*|}
			lon=${point%%|*}
			point=${point#*|}
			stop_code=${point%%|*}
			stop_name=${point##*|}

# Must exclude 'Метро' - causes js error
			echo "		{lat: $lat, lon: $lon, stopcode: $stop_code, stopname: '$stop_name'},"
		done

		echo "	]},"
	done

	echo "];"
} > app_database.js
