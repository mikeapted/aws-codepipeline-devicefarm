#!/bin/bash

function die {
    echo $1
    exit 1
}

#pkg_root_dir=`find $PWD | grep "/Config$" | head -n 1 | xargs dirname`
#app_filename="$pkg_root_dir/app/app.apk"
app_filename="../app/build/outputs/apk/debug/app-debug.apk"
ls -1 $app_filename || die "Did not find app in $pkg_root_dir"

appium --pre-launch --app-pkg com.example.myapplication --app-activity .MainActivity --platform-name Android --app $app_filename
