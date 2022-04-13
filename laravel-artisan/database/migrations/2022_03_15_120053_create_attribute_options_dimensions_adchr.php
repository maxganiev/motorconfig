<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttributeOptionsDimensionsAdchr extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //прописать столбцы для всех опций:
        Schema::create('oc_adchr_options_dimensions', function (Blueprint $table) {
            $table->integer('id');
            $table->string('framesize');
            $table->integer('with_brake');
            $table->integer('with_encoder');
            $table->integer('with_vent');
            $table->integer('height_if_naezd')->default(0);
            $table->integer('with_brake_and_encoder');
            $table->integer('with_brake_and_vent');
            $table->integer('with_vent_and_encoder');
            $table->integer('with_brake_and_encoder_and_vent');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('oc_adchr_options_dimensions');
    }
}
