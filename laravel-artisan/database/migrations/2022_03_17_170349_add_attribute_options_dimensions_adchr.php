<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAttributeOptionsDimensionsAdchr extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('oc_adchr_options_dimensions', function (Blueprint $table) {
            $table->string('d4')->after('with_brake_and_encoder_and_vent');
            $table->integer('l4')->after('with_brake_and_encoder_and_vent');
            $table->string('d5')->after('with_brake_and_encoder_and_vent');
            $table->integer('l5')->after('with_brake_and_encoder_and_vent');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('oc_adchr_options_dimensions', function (Blueprint $table) {
            $table->dropColumn('d4');
            $table->dropColumn('l4');
            $table->dropColumn('d5');
            $table->dropColumn('l5');
        });
    }
}
