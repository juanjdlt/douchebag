<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDouchejarTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('douchejar', function(Blueprint $table)
		{
			$table->increments('id')->unsigned();
			$table->string('name', 36)->unique();
			$table->string('description', 150)->nullable();
			$table->smallInteger('multiplier')->unsigned()->default(1);
			$table->timestamps();
			$table->softDeletes();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('douchejar');
	}

}