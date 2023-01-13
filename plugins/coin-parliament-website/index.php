<?php
/*
Plugin Name: Coin Parliament Website
Author: Avi Levkovich
*/

function get_my_menu() {
    // Replace your menu name, slug or ID carefully
    return wp_get_menu_array(2);
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'wp/v2', 'menu', array(
        'methods' => 'GET',
        'callback' => 'get_my_menu',
        'permission_callback' => '__return_true',
    ) );
} );

function wp_get_menu_array($current_menu) {

    $array_menu = wp_get_nav_menu_items($current_menu);
    $menu = array();
    foreach ($array_menu as $m) {
        if (empty($m->menu_item_parent)) {
            $menu[$m->ID] = array();
            $menu[$m->ID]['ID']      =   $m->ID;
            $menu[$m->ID]['title']       =   $m->title;
            $menu[$m->ID]['url']         =   $m->url;
            $menu[$m->ID]['children']    =   array();
        }
    }
    $submenu = array();
    foreach ($array_menu as $m) {
        if ($m->menu_item_parent) {
            $submenu[$m->ID] = array();
            $submenu[$m->ID]['ID']       =   $m->ID;
            $submenu[$m->ID]['title']    =   $m->title;
            $submenu[$m->ID]['url']  =   $m->url;
            $menu[$m->menu_item_parent]['children'][$m->ID] = $submenu[$m->ID];
        }
    }
    return $menu;

}

function mytheme_register_nav_menu(){
    register_nav_menus( array(
        'primary_menu' => 'Primary Menu',
    ) );
}
add_action( 'after_setup_theme', 'mytheme_register_nav_menu', 0 );


function coin_parliament_site()
{
    do_action('wp_enqueue_scripts');

    if ('HEAD' === $_SERVER['REQUEST_METHOD'] && apply_filters('exit_on_http_head', true)) {
        exit;
    }

    if (is_robots()) {
        /**
         * Fired when the template loader determines a robots.txt request.
         *
         * @since 2.1.0
         */
        do_action('do_robots');
        return;
    } elseif (is_favicon()) {
        /**
         * Fired when the template loader determines a favicon.ico request.
         *
         * @since 5.4.0
         */
        do_action('do_favicon');
        return;
    } elseif (is_feed()) {
        do_feed();
        return;
    } elseif (is_trackback()) {
        require ABSPATH . 'wp-trackback.php';
        return;
    }

    ?>
    <!doctype html>
    <html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo('charset'); ?>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <?php wp_head(); ?>
    </head>

    <body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <script type="text/html" id="menu_items">
        <?php
        $menu_name = 'primary_menu';
    if ( ( $locations = get_nav_menu_locations() ) && isset( $locations[ $menu_name ] ) ) {
        $menu = wp_get_nav_menu_object($locations[$menu_name]);

        $menu_items = wp_get_nav_menu_items($menu->term_id);
    } else {
        $menu_items = [];
    }
        ?>
        <?php echo json_encode($menu_items); ?>
    </script>
    <?php
    if (have_posts()) {
        while (have_posts()) {
            the_post();
            ?>

            <?php
        }
    }
    echo do_shortcode("[coin_parliament]");
    ?>
    <?php wp_footer(); ?>
    </body>
    </html>
    <?php
    die();
}

add_action('template_redirect', 'coin_parliament_site');
