<?php
//root/Eloquent/Product
use Eloquent\Product;
use Eloquent\CategoryProduct;
use Eloquent\AttributeProduct;
use Eloquent\AttributeTo;
use Eloquent\AttributeDescription;
use Eloquent\OptionsDimensionsAdchr;

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
				$ifSomeOption && array_push($attrIds, $l4, $d4);

				break;

			case 2001:
			case 2081:
			case 2181:
			case 'B35':
			case 'B4':

				fillAttrs($attrIds, [$l30, $h31, $d24, $l1, $l10, $l31, $d1, $d10, $d20, $d22, $d25, $b1, $b10, $h1, $h10, $h, $h5]);
				$ifSomeOption && array_push($attrIds, $l4, $d4);

				break;

			case 3081:
			case 3001:
			case 'B5':
			case 'B14':

				fillAttrs($attrIds, [$l30, $h31, $d24, $l1, $d1, $d20, $d22, $d25, $b1, $h1, $h, $h5]);
				$ifSomeOption && array_push($attrIds, $l4, $d4);

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
				if ($pawId == $pawtype) {
					return $item->to_id;
				}
			})->pluck('to_id')[0];



			$attr_keys = AttributeDescription::whereIn('attribute_id', $attrIds)->select('name')->get()->pluck('name')->toArray();
			$attr_values = AttributeTo::where('to_id', $to_product_id)->whereIn('attribute_id', $attrIds)->select('text')->get()->pluck('text')->toArray();

			$combo_assoc = array_combine($attr_keys, $attr_values);

			if ($ifSomeOption) {
				$frame = $this->checkFrameSize($frameSize, $type, $model);
				$this->setL30($l30, $frame, $with_brakes, $with_encoder, $with_vent);
				$combo_assoc['l30'] = $l30;

				if ($with_naezd_vent != 'false') {
					$this->setH($h, $frame);
					$combo_assoc['h'] = $h;
				}
			}


			return $combo_assoc;
		}
		//getting attributes by power and rpm selection:
		else {
			$product = $this->get_data_by_power_and_rpm_selection($power, $rpm, $type);

			//checking if single or multiple products have been returned, if multiple resuls were returned:
			if (gettype($product) !== 'object' || count($product) !== 1) {
				return;
			}

			//if single - returning attrs:
			else {
				$to_product_id = array_column((array)$product, 'relOffers')[0]->values()->flatten(1)->filter(function ($item) use ($pawtype) {

					//rel_offers[i]->model example: 5АИ 200 М 1001 - last 4 digits are being sliced out and kept with substr(strrpos - last index of ' ')
					$pawId = substr($item->model, strrpos($item->model, ' '));

					//non strict comparison as pawtype is string and pawId is number:
					if ($pawId == $pawtype) {
						return $item->to_id;
					}
				})->pluck('to_id')[0];

				$attr_keys = AttributeDescription::whereIn('attribute_id', $attrIds)->select('name')->get()->pluck('name')->toArray();
				$attr_values = AttributeTo::where('to_id', $to_product_id)->whereIn('attribute_id', $attrIds)->select('text')->get()->pluck('text')->toArray();

				$combo_assoc = array_combine($attr_keys, $attr_values);

				if ($ifSomeOption) {
					$frame = $this->checkFrameSize($frameSize, $type, $model);
					$this->setL30($l30, $frame, $with_brakes, $with_encoder, $with_vent);
					$combo_assoc['l30'] = $l30;

					if ($with_naezd_vent != 'false') {
						$this->setH($h, $frame);
						$combo_assoc['h'] = $h;
					}
				}

				return $combo_assoc;
			}
		}
	}

	public function checkFrameSize($frameSize, $type, $model)
	{
		if ($frameSize < 132) {
			return $frameSize;
		} else {
			if ($type === 'ESQ') {
				$size = explode('-', substr($model, 4))[0];
				return $size;
			} else {
				$size = substr($model, 5);
				$temp = explode(' ', $size)[2];
				$num = implode(array_filter(str_split($temp), function ($item) {
					return preg_match('/^[0-9]*$/', $item);
				}));


				$size_splitted_by_spaces = explode(' ', $size);


				//encode possible russian letters (issues were faced with M only; M encoded to D then replaced with latin M in below):
				$encoded = iconv('UTF-8', 'ASCII//TRANSLIT', utf8_encode($size_splitted_by_spaces[2][0]));

				//ex. 160, 200 etc.
				$frameNumber = $size_splitted_by_spaces[1];

				//ex. M, S etc.
				$frameId = str_contains($encoded, 'D') ? str_replace('D', 'M', $encoded) : $encoded;

				//Id modification ref. No., ex. 2, 4, 8 etc.
				$frameIdModif = $size_splitted_by_spaces[2][strlen($size_splitted_by_spaces[2]) - 1];

				if ($frameNumber < 200) {
					$subsize = $frameNumber . $frameId;
					return $subsize;
				} else {
					if ($num < 4) {
						$subsize = $frameNumber . $frameId . $frameIdModif;
						return $subsize;
					} else {
						$subsize = $size_splitted_by_spaces[1] . $frameId . '4-8';
						return $subsize;
					}
				}
			}
		}
	}

	public function setL30(&$arg, $frame,  $with_brakes, $with_encoder, $with_vent)
	{
		if ($with_brakes == 'true' && $with_encoder == 'false' && $with_vent == 'false') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->select('with_brake')->get()[0]['with_brake'];
		} else if ($with_brakes == 'false' && $with_encoder == 'true' && $with_vent == 'false') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->select('with_encoder')->get()[0]['with_encoder'];
		} else if ($with_brakes == 'false' && $with_encoder == 'false' && $with_vent == 'true') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->select('with_vent')->get()[0]['with_vent'];
		} else if ($with_brakes == 'true' && $with_encoder == 'true' && $with_vent == 'false') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->select('with_brake_and_encoder')->get()[0]['with_brake_and_encoder'];
		} else if ($with_brakes == 'true' && $with_encoder == 'false' && $with_vent == 'true') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->select('with_brake_and_vent')->get()[0]['with_brake_and_vent'];
		} else if ($with_brakes == 'false' && $with_encoder == 'true' && $with_vent == 'true') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->select('with_vent_and_encoder')->get()[0]['with_vent_and_encoder'];
		} else if ($with_brakes == 'true' && $with_encoder == 'true' && $with_vent == 'true') {
			$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->select('with_brake_and_encoder_and_vent')->get()[0]['with_brake_and_encoder_and_vent'];
		}

		return $arg;
	}

	public function setH(&$arg, $frame)
	{
		$arg = OptionsDimensionsAdchr::where('framesize', 'like', $frame)->select('height_if_naezd')->get()[0]['height_if_naezd'];

		return $arg;
	}
}
