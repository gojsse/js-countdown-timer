<!DOCTYPE html>
<html>

<head id="head">
    <META HTTP-EQUIV="Content-type" CONTENT="text/html; charset=UTF-8">
    <title>Countdown Clock Demo</title>
    <link href="https://fonts.googleapis.com/css?family=Nanum+Gothic|Poiret+One|Roboto+Slab&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="build/css/styles.min.css">
</head>

<body>
    <?php
    /**
     * $meta array [
     *      'id'                     => number
     *      'end_date_and_time'      => unix timestamp
     *      'clock_type'             => default | flip | disc | undefined
     *      'digit_opacity'          => number 0.0 ~ 1.0
     *      'digit_text_color'       => string with hex color value
     *      'digit_background_color' => string with hex color value
     *      'hide_digit_separators'  => boolean
     *      'separator_color'        => string with hex color value
     *      'label_position'         => top | undefined
     *      'label_color'            => string with hex color value
     * ]
     */
    function countdown($meta)
    {
        // Create clock date time
        $end_date_and_time       = $meta['end_date_and_time'];
        $timezone_string         = $meta['timezone_string'] ?? 'America/Chicago';
        $clock_end_date_and_time = DateTime::createFromFormat(
            'U',
            $end_date_and_time,
            new DateTimeZone($timezone_string)
        );

        // Get clock type and style settings from ACF
        $clock_type                   = $meta['clock_type'] ?? 'default';
        $clock_digit_opacity          = $meta['digit_opacity'] ?? 1;
        $clock_digit_text_color       = $meta['digit_text_color'] ?? '#000';
        $clock_digit_background_color = $meta['digit_background_color'] ?? '#fff';
        $clock_hide_digit_separators  = $meta['hide_digit_separators'] ?? false;
        $clock_separator_color        = $meta['separator_color'] ?? '#fff';
        $clock_label_position         = $meta['label_position'] ?? 'top';
        $clock_label_color            = $meta['label_color'] ?? '#fff';
        $clock_align = 'center';

        // Settings based on shortcode attributes
        switch ($meta['align']) {
            case 'start':
                $clock_align = 'flex-start';
                break;
            case 'end':
                $clock_align = 'flex-end';
                break;
        }

        $clock_styles = sprintf(
            '<style type="text/css">
            #clock-%1$s .clock { background-color: %2$s; opacity: %4$s; }
            #clock-%1$s .clock__digit-face { background-color: %2$s; color: %3$s; }
            #clock-%1$s .clock__label { color: %5$s; }
            #clock-%1$s .clock__digit-separator span { %6$s }
            #clock-%1$s { justify-content: %7$s }
            </style>',
            $meta['id'],
            $clock_type === 'flip' || $clock_type === 'disc' ? $clock_digit_background_color : 'transparent',
            $clock_digit_text_color,
            $clock_digit_opacity,
            $clock_label_color,
            (bool) $clock_hide_digit_separators === true ? 'display: none;' : 'background-color: ' . $clock_separator_color,
            $clock_align
        );

        $clock_class_list = $clock_type === 'disc' ? ' countdown-clock--discs' : '';
        $clock_class_list .= $clock_label_position === 'top' ? ' countdown-clock--label-top' : ' countdown-clock--label-bottom';

        $clock_html = sprintf(
            '<div id="clock-%1$s" class="style--%1$s countdown-clock%2$s" data-end-time="%3$s"%4$s></div>',
            $meta['id'],
            $clock_class_list,
            $clock_end_date_and_time->format('U'),
            $clock_type === 'flip' ? ' data-is-flip-clock="true"' : ''
        );

        return $clock_styles . "\n" . $clock_html;
    }

    $clocks = [
        [
            'id'                     => '0',
            'end_date_and_time'      => 1999832312,
            'label_color'            => 'pink',
            'separator_color'        => 'pink',
            'digit_text_color'       => 'black',
            'digit_background_color' => 'lavender',
            'clock_type'             => 'disc'
        ],
        [
            'id' => '1',
            'end_date_and_time'      => 1990835000,
            'label_color'            => '#ff0000',
            'separator_color'        => '#ff0000'
        ],
        [
            'id'                     => '2',
            'end_date_and_time'      => 1653337432,
            'clock_type'             => 'disc'
        ],
        [
            'id' => '3',
            'end_date_and_time'      => 1653837432,
            'digit_text_color'       => '#00ffff'
        ],
    ];

    foreach ($clocks as $clock) {
        echo countdown($clock);
    }
    ?>

    <script src="build/js/scripts.js"></script>
</body>