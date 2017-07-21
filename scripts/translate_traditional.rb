# 泰语翻译
#!/usr/bin/ruby 
require 'find'
require 'uri'
require 'open-uri'
require 'digest/md5'
require 'json'

def translate(key, value, outputFile)
  puts "#{key}  #{value} ";
  randtemp = rand(999).to_s;
  originword = value;
  escapeword = URI.escape(originword);
  appid = '20170327000043509';
  scretkey = 'fbzhfhY4ujWPHxZrN2BY';
  appid << originword << randtemp << scretkey;
  md5content = Digest::MD5.hexdigest(appid);
  url = "http://api.fanyi.baidu.com/api/trans/vip/translate?q=#{escapeword}&from=zh&to=cht&appid=20170327000043509&salt=#{randtemp}&sign=#{md5content}"
  uri = URI.parse(url)
  open(uri) {|f| 
    json = JSON.parse(f.read)
    trans_result = json['trans_result']
    src = trans_result[0]['src']
    dst = trans_result[0]['dst']
    lineresult = key << ':"' << dst << '",'
    outputFile.puts lineresult
  }
end

  resultFilename = '../js/common/I18n/cht.json'
  if File.exist?(resultFilename)
    File.delete(resultFilename);
    temp = File.new(resultFilename, 'w')
  else
    temp = File.new(resultFilename, 'w')
  end

  file = File.open('../js/common/I18n/zh.json', 'r')
  temp.puts '{'
  temp.puts '  "datas": {'
  file.each do |line|
    if line.include?(':')
      i18nKey = line.split(':')[0];
      i18nValue = line.split(':')[1].lstrip.delete(",").delete("'")
      translate(i18nKey, i18nValue, temp);
    end
  end
  file.close
  temp.puts '  }'
  temp.puts '}'
  temp.close