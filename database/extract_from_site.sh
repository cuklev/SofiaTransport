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

		route_count=2 # A hackish workaround for weekdays / weekends
		echo Downloading $rel_path >&2

		while read direction; do
			if [[ "$direction" == "--" ]]; then
				continue
			elif [[ "$direction" == *"span"* ]]; then
				let route_count-=1
				routename=$(echo "$direction" | sed 's/<[^>]*>//g')

				echo "	{linename: '$linename', linetype: $linetype, routeid: '$routeid', routename: '$routename', stops: ["

				while read stop; do
					stop=${stop#*sign/}
					curr_route=${stop%%/*}
					[ "$routeid" == "$curr_route" ] || continue

					stop=${stop#*/}
					stopcode=${stop%%\"*}
					stop=${stop%</a>}
					stopname=${stop##*>}

					echo "		{stopcode: $stopcode, stopname: '$stopname'},"
				done < <(curl -s "$base_url""$rel_path" | grep '#sign/')

				echo "	]},"
				[[ $route_count == 0 ]] && break
			else
				direction=${direction#*href=\"}
				direction=${direction%%\"*}

				routeid=${direction##*/}
			fi
		done < <(curl -s "$base_url""$rel_path" | grep -A 1 '#direction')
	done < <(curl -s "$base_url"| grep -Eo 'href="(tramway|autobus|trolley)[^"]*' | sed 's/href="//')

	echo "];"
} > site_database.js
