# 检测项目中没有用到的国际化条目
#!/usr/bin/ruby

require 'find'

if File.exist?('../../result.txt')
  result = File.open('../../result.txt', 'a')
else
  result = File.new('../../result.txt', 'w')
end

Dir['../js/common/I18n/**/**.js'].each do |i18nFilename|
  result.puts "==========#{i18nFilename}=========="

  file = File.open(i18nFilename, 'r')
  file.each do |line|
    if line.include?(':')
      exist = false
      i18nKey = line.split(':')[0].lstrip
      Find.find('../js/views', '../js/common') do |filename|
        exist = true if !filename.split('/').include?('api') && !filename.split('/').include?('I18n') && filename.include?('.js') && File.open(filename, 'r').grep(/#{i18nKey}/).length > 0
      end

      result.puts "I18N的key：#{i18nKey}" if !exist
    end
  end
  file.close
end

result.close