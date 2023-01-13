<?php
/*
Plugin Name: Coin Parliament
Author: Avi Levkovich
*/

add_shortcode('coin_parliament', 'coin_parliament_func');
function coin_parliament_func($atts)
{
    return "<div id='app'></div>";
}

function str_replace_first($search, $replace, $subject)
{
    $search = '/' . preg_quote($search, '/') . '/';
    return preg_replace($search, $replace, $subject, 1);
}

function fetch_css()
{
    $str = file_get_contents(__DIR__ . '/public/index.html');

    $re = '/\<link.*\>/m';

    preg_match_all($re, $str, $matches, PREG_SET_ORDER, 0);

    foreach ($matches as $match) {
        $re = '/href=["\']?([^"\'>]+)["\']/m';
        preg_match_all($re, $match[0], $ms, PREG_SET_ORDER, 0);
        if(count($ms)>0) {
            foreach ($ms as $mm) {
                if (substr($mm[1], 0, 1) === "/") {
                    $m = plugin_dir_url(__FILE__) . 'public' . $mm[1];
                } else {
                    $m = $mm[1];
                }
                wp_enqueue_style(sanitize_title($m), $m);
            }
        }
    }
}

add_action('wp_enqueue_scripts', 'fetch_css');

function fetch_js()
{
    $str = file_get_contents(__DIR__ . '/public/index.html');

    $re = '/\<script.*\>/m';

    preg_match_all($re, $str, $matches, PREG_SET_ORDER, 0);

    foreach ($matches as $match) {
        $re = '/src=["\']?([^"\'>]+)["\']/m';
        preg_match_all($re, $match[0], $ms, PREG_SET_ORDER, 0);

        if(count($ms)>0) {
            foreach ($ms as $mm) {
                if (substr($mm[1], 0, 1) === "/") {
                    $m = plugin_dir_url(__FILE__) . 'public' . $mm[1];
                } else {
                    $m = $mm[1];
                }
                wp_enqueue_script(sanitize_title($m), $m, []);
            }
        }
    }
}

add_action('wp_enqueue_scripts', 'fetch_js');

function fetch_inline_js() {
    $str = file_get_contents(__DIR__ . '/public/index.html');
    $re = '#<script>(.*?)</script>#s';
    preg_match($re, $str, $matches, PREG_OFFSET_CAPTURE, 0);
    echo $matches[0][0];
}

add_action('wp_footer', 'fetch_inline_js');

function add_to_htaccess( $rules ) {

    $content = <<<EOD
<IfModule mod_rewrite.c>
RewriteEngine on
RewriteRule ^/firebase-messaging-sw.js$ https://coin-parliament.com/wp-content/plugins/coin-parliament/public/firebase-messaging-sw.js [R=301,L]
</IfModule>\n\n
EOD;
    return $content . $rules;

}
add_filter('mod_rewrite_rules', 'add_to_htaccess');

function myplugin_enable_flush_rules() {

    global $wp_rewrite;

    // flush the rewrite rules
    $wp_rewrite->flush_rules();

}

// on plugin activation, call the function that will make flush_rules to be called at the end of the PHP execution
register_activation_hook( __FILE__, 'myplugin_enable_flush_rules' );
