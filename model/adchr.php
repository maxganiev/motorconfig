<?php
//root/Eloquent/Product
use Eloquent\Product;
use Eloquent\CategoryProduct;
use Eloquent\AttributeProduct;
use Eloquent\AttributeTo;
use Eloquent\AttributeDescription;
use Eloquent\OptionsDimensionsAdchr;
use Eloquent\OptionsPricelistAdchr;

class ModelToolAdchrTestAdchr extends Model
{
	public function get_data_by_input($keyword, $type)
	{
		//обработка post запросов
		if ($type == '5AI') {
			$category_id = [69];
			$like = '%5АИ%';
		}

		if ($type == 'ESQ') {
			$category_id = [296];
			$like = '%ESQ%';
		}

		$products = CategoryProduct::whereIn('category_id', $category_id)->select('product_id')->get()->pluck('product_id')->toArray();

		$product = Product::with(['relOffers' => function ($query) {
			$query->with(['desc', 'setka', 'brake']);
		}])
			->with('attrs')
			->whereIn('product_id', $products)
			->where('model', 'like', '%' . $keyword . '%')
			->where('model', 'like', $like)
			->get();

		return $product;
	}

	public function get_data_by_power_and_rpm_selection($power, $rpm, $type)
	{
		if ($type == '5AI') {
			$category_id = [69];
			$like = '%5АИ%';
		}

		if ($type == 'ESQ') {
			$category_id = [296];
			$like = '%ESQ%';
		}

		$products = CategoryProduct::whereIn('category_id', $category_id)->select('product_id')->get()->pluck('product_id')->toArray();

		$products = Product::whereIn('product_id', $products)
			->where('model', 'like', $like)
			->select('product_id')
			->get()
			->pluck('product_id')
			->toArray();

		$products = AttributeProduct::whereIn('product_id', $products)
			->whereIn('text', [$power, $rpm])
			->whereIn('attribute_id', ['33', '36'])
			->whereNotIn('attribute_id', ['103'])
			->get()
			->groupBy('product_id');
		$result = [];

		foreach ($products as $key => $value) {
			if (count($value) > 1) {
				$result[] = array_unique($value->pluck('product_id')->toArray());
			}
		}

		if (!empty($result) && count($result) > 1 && $type == 'ESQ') {
			return $this->getProductsByIds($result, $type);
		} else if (!empty($result) && count($result) == 1) {
			return $this->getProductById($result[0], $type);
		} else {
			return [];
		}
	}

	public function getProductsByIds($array, $type)
	{
		$tmp = [];
		foreach ($array as $product_id) {
			$tmp[] = $this->getProductById($product_id, $type);
		}
		return $tmp;
	}

	public function getProductById($product_id, $type)
	{
		if ($type == '5AI') {
			$like = '%5АИ%';
		}
		if ($type == 'ESQ') {
			$like = '%ESQ%';
		}
		return Product::with(['relOffers' => function ($query) {
			$query->with(['desc', 'setka', 'brake']);
		}])
			->with('attrs')
			->whereIn('product_id', $product_id)
			->where('model', 'like', $like)
			->get()[0];
	}

	public function get_attrs($keyword, $type, $model, $pawtype, $with_brakes, $with_encoder, $with_vent, $with_naezd_vent, $power, $rpm, $frameSize)
	{

		$attrIds = [];

		function fillAttrs(&$arr, $val)
		{
			$arr = $val;
		}


		//attrs ids:
		$l30 = '50';
		$h31 = '51';
		$d24 = '52';
		$l1 = '53';
		$l10 = '54';
		$l31 = '55';
		$d1 = '56';
		$d10 = '57';
		$d20 = '58';
		$d22 = '59';
		$d25 = '60';
		$b1 = '61';
		$b10 = '62';
		$h1 = '63';
		$h10 = '64';
		$h = '65';
		$h5 = '66';
		$l4 = null;
		$d4 = null;


		$ifSomeOption = ($with_brakes != 'false' || $with_encoder != 'false' || $with_vent != 'false') == 1 ? true : false;

		switch ($pawtype) {
			case 1081:
			case 1001:
			case 'B3':

				fillAttrs($attrIds, [$l30, $h31, $l1, $l10, $l31, $d1, $d10, $b1, $b10, $h1, $h10, $h, $h5]);

				break;

			case 2001:
			case 2081:
			case 2181:
			case 'B35':
			case 'B4':

				fillAttrs($attrIds, [$l30, $h31, $d24, $l1, $l10, $l31, $d1, $d10, $d20, $d22, $d25, $b1, $b10, $h1, $h10, $h, $h5]);

				break;

			case 3081:
			case 3001:
			case 'B5':
			case 'B14':

				fillAttrs($attrIds, [$l30, $h31, $d24, $l1, $d1, $d20, $d22, $d25, $b1, $h1, $h, $h5]);

				break;
		}


		//getting attributes by model input:
		if ($power === '-' || $rpm === '-') {
			//print_r($attrIds);
			$product = $this->get_data_by_input($keyword, $type);


			$to_product_id = $product->filter(function ($each) use ($model) {
				return $each->model === $model;
			})->values()->pluck('relOffers')->flatten(1)->filter(function ($item) use ($pawtype) {
				//rel_offers[i]->model example: 5АИ 200 М 1001 - last 4 digits are being sliced out and kept with substr(strrpos - last index of ' ')
				$pawId = substr($item->model, strrpos($item->model, ' '));
				//non strict comparison as pawtype is string and pawId is number:
				if (trim($pawId) == $pawtype) {
					return $item->to_id;
				}
			})->pluck('to_id')[0];

			$attr_keys = AttributeDescription::whereIn('attribute_id', $attrIds)->select('name')->get()->pluck('name')->toArray();
			$attr_values = AttributeTo::where('to_id', $to_product_id)->whereIn('attribute_id', $attrIds)->select('text')->get()->pluck('text')->toArray();

			$combo_assoc = array_combine($attr_keys, $attr_values);

			if ($ifSomeOption) {
				$frame = $this->checkFrameSize($frameSize, $type, $model);
				$this->setL30($l30, $type, $frame, $with_brakes, $with_encoder, $with_vent);
				$combo_assoc['l30'] = $l30;

				$this->setD4($d4, $frame, $type);
				$combo_assoc['d4'] = $d4;

				$this->setL4($l4, $frame, $type);
				$combo_assoc['l4'] = $l4;


				if ($with_naezd_vent != 'false') {
					$this->setH31($h31, $frame, $type);
					$combo_assoc['h31'] = $h31;
				}
			}
		}
		//getting attributes by power and rpm selection:
		else {
			$product_raw = $this->get_data_by_power_and_rpm_selection($power, $rpm, $type);
			$index = array_keys(array_filter(array_column((array)$product_raw, 'model'), function ($item) use ($model) {
				return $item == $model;
			}))[0];

			$product = gettype($product_raw) !== 'object' || count($product_raw) !== 1 ? $product_raw[$index] : $product_raw;

			$to_product_id = array_column((array)$product, 'relOffers')[0]->values()->flatten(1)->filter(function ($item) use ($pawtype) {

				//rel_offers[i]->model example: 5АИ 200 М 1001 - last 4 digits are being sliced out and kept with substr(strrpos - last index of ' ')
				$pawId = substr($item->model, strrpos($item->model, ' '));

				//non strict comparison as pawtype is string and pawId is number:
				if (trim($pawId) == $pawtype) {
					return $item->to_id;
				}
			})->pluck('to_id')[0];

			$attr_keys = AttributeDescription::whereIn('attribute_id', $attrIds)->select('name')->get()->pluck('name')->toArray();
			$attr_values = AttributeTo::where('to_id', $to_product_id)->whereIn('attribute_id', $attrIds)->select('text')->get()->pluck('text')->toArray();

			$combo_assoc = array_combine($attr_keys, $attr_values);

			if ($ifSomeOption) {
				$frame = $this->checkFrameSize($frameSize, $type, $model);
				$this->setL30($l30, $type, $frame, $with_brakes, $with_encoder, $with_vent);
				$combo_assoc['l30'] = $l30;

				$this->setD4($d4, $frame, $type);
				$combo_assoc['d4'] = $d4;

				$this->setL4($l4, $frame, $type);
				$combo_assoc['l4'] = $l4;

				if ($with_naezd_vent != 'false') {
					$this->setH31($h31, $frame, $type);
					$combo_assoc['h31'] = $h31;
				}
			}
		}

		//getting pricelist for current framesize:
		$pricelist = OptionsPricelistAdchr::where('framesize', 'like', $frameSize)->get()->toArray()[0];

		//return result:
		return array(['pricelist' => $pricelist], ['dims' => $combo_assoc]);
	}

	public function checkFrameSize($frameSize, $type, $model)
	{
		switch ($type) {
			case '5AI':
				if ($frameSize < 132) {
					return $frameSize;
				} else {
					$size = substr($model, 5);
					$temp = explode(' ', $size)[2];

					//Id modification ref. No., ex. 2, 4, 8 etc.
					$frameIdModif = implode(array_filter(str_split($temp), function ($item) {
						return preg_match('/^[0-9]*$/', $item);
					}));


					$size_splitted_by_spaces = explode(' ', $size);

					//encode possible russian letters (issues were faced with M only; M encoded to D then replaced with latin M in below):
					$encoded = iconv('UTF-8', 'ASCII//TRANSLIT', utf8_encode($size_splitted_by_spaces[2][0]));

					//ex. M, S etc.
					$frameId = str_contains($encoded, 'D') ? str_replace('D', 'M', $encoded) : $encoded;

					if ($frameSize < 200 || $frameSize == 250) {
						$subsize = $frameSize . $frameId;
						return $subsize;
					} else {
						if ($frameIdModif < 4) {
							$subsize = $frameSize . $frameId . $frameIdModif;
							return $subsize;
						} else {
							$subsize = $size_splitted_by_spaces[1] . $frameId . '4-8';
							return $subsize;
						}
					}
				}

				break;

			case 'ESQ':
				if ($frameSize < 90) {
					return $frameSize;
				} else {
					//ex. 200LA2
					$size = explode('-', substr($model, 4))[0];

					$frameId_temp = array_filter(str_split($size), function ($item) {
						return preg_match('/[a-zA-Z]+/', $item);
					});
					//ex. M, S etc.
					$frameId = $frameId_temp[array_keys($frameId_temp)[0]];

					$temp = substr($size, strpos($size, $frameSize) + strlen($frameSize));
					//Id modification ref. No., ex. 2, 4, 8 etc.
					$frameIdModif =  implode(array_filter(str_split($temp), function ($item) {
						return preg_match('/^[0-9]*$/', $item);
					}));

					if ($frameSize < 225 || ($frameSize == 225 && $frameId == 'S') || ($frameSize == 250) || $frameSize == 280) {
						$subsize = $frameSize . $frameId;
						return $subsize;
					} else {
						if ($frameIdModif <= 2) {
							$subsize = $frameSize . $frameId . $frameIdModif;
							return $subsize;
						} else {
							$subsize = $frameSize . $frameId . '4-8';
							return $subsize;
						}
					}
				}

				break;
		}
	}

	public function setL30(&$arg, $type, $frame,  $with_brakes, $with_encoder, $with_vent)
	{

		if ($with_brakes == 'true' && $with_encoder == 'false' && $with_vent == 'false') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->where('type', 'like', $type)->select('l30_with_brake')->get()[0]['l30_with_brake'];
		} else if ($with_brakes == 'false' && $with_encoder == 'true' && $with_vent == 'false') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->where('type', 'like', $type)->select('l30_with_encoder')->get()[0]['l30_with_encoder'];
		} else if ($with_brakes == 'false' && $with_encoder == 'false' && $with_vent == 'true') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->where('type', 'like', $type)->select('l30_with_vent')->get()[0]['l30_with_vent'];
		} else if ($with_brakes == 'true' && $with_encoder == 'true' && $with_vent == 'false') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->where('type', 'like', $type)->select('l30_with_brake_and_encoder')->get()[0]['l30_with_brake_and_encoder'];
		} else if ($with_brakes == 'true' && $with_encoder == 'false' && $with_vent == 'true') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->where('type', 'like', $type)->select('l30_with_brake_and_vent')->get()[0]['l30_with_brake_and_vent'];
		} else if ($with_brakes == 'false' && $with_encoder == 'true' && $with_vent == 'true') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->where('type', 'like', $type)->select('l30_with_vent_and_encoder')->get()[0]['l30_with_vent_and_encoder'];
		} else if ($with_brakes == 'true' && $with_encoder == 'true' && $with_vent == 'true') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->where('type', 'like', $type)->select('l30_with_brake_and_encoder_and_vent')->get()[0]['l30_with_brake_and_encoder_and_vent'];
		}

		return $arg;
	}

	public function setH31(&$arg, $frame, $type)
	{
		$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->where('type', 'like', $type)->select('h31_if_naezd')->get()[0]['h31_if_naezd'];

		return $arg;
	}

	public function setD4(&$arg, $frame, $type)
	{
		$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->where('type', 'like', $type)->select('d4')->get()[0]['d4'];

		return $arg;
	}

	public function setL4(&$arg, $frame, $type)
	{
		$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->where('type', 'like', $type)->select('l4')->get()[0]['l4'];

		return $arg;
	}
}
